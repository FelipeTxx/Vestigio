<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
class GenerateModule extends Command
{
    protected $signature = 'module:generate {module} {name}';

    protected $description = 'Gera a estrutura de um módulo';

    public function handle()
    {
        $module = Str::studly($this->argument('module'));
        $name = Str::studly($this->argument('name'));

        $namespace = "App\\Modules\\{$module}\\{$name}";
        $path = app_path("Modules/{$module}/{$name}");

        if (File::exists($path)) {
            $this->error("O módulo {$module}/{$name} já existe.");
            return self::FAILURE;
        }

        // Diretórios
        $directories = [
            'Http',
            'Middleware',
            'Routes',
        ];

        foreach ($directories as $directory) {
            File::ensureDirectoryExists("$path/$directory");
        }

        $routeName = Str::plural(Str::snake($name));

        $files = [];

        // Model
        $files[$name . '.php'] = <<<PHP
<?php

namespace {$namespace};

use Illuminate\Database\Eloquent\Model;

class {$name} extends Model
{
    protected \$fillable = [

    ];
}
PHP;

        // Service
        $files[$name . 'Service.php'] = <<<PHP
<?php

namespace {$namespace};

class {$name}Service
{
    public function listar()
    {
        return {$name}::all();
    }

    public function criar(array \$dados)
    {
        return {$name}::create(\$dados);
    }

    public function buscar(int \$id)
    {
        return {$name}::findOrFail(\$id);
    }

    public function atualizar(int \$id, array \$dados)
    {
        \$registro = \$this->buscar(\$id);
        \$registro->update(\$dados);

        return \$registro;
    }

    public function excluir(int \$id)
    {
        return \$this->buscar(\$id)->delete();
    }
}
PHP;

        // Controller
        $files['Http/' . $name . 'Controller.php'] = <<<PHP
<?php

namespace {$namespace}\\Http;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use {$namespace}\\{$name}Service;

class {$name}Controller extends Controller
{
    public function __construct(
        private {$name}Service \$service
    ) {}

    public function index()
    {
        return response()->json(\$this->service->listar());
    }

    public function store(Request \$request)
    {
        \$dados = \$request->validate([
            'titulo' => 'required|string|max:255',
            'conteudo' => 'nullable|string',
        ]);

        \$dados['user_id'] = \$request->user()?->id;

        return response()->json(
            \$this->service->criar(\$dados),
            201
        );
    }

    public function show(int \$id)
    {
        return response()->json(\$this->service->buscar(\$id));
    }

    public function update(Request \$request, int \$id)
    {
        \$dados = \$request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'conteudo' => 'nullable|string',
        ]);

        return response()->json(
            \$this->service->atualizar(\$id, \$dados)
        );
    }

    public function destroy(int \$id)
    {
        \$this->service->excluir(\$id);

        return response()->noContent();
    }
}
PHP;

        // Middleware
        $files['Middleware/' . $name . 'Middleware.php'] = <<<PHP
<?php

namespace {$namespace}\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class {$name}Middleware
{
    public function handle(Request \$request, Closure \$next): Response
    {
        return \$next(\$request);
    }
}
PHP;

        // API Routes
        $files['Routes/api.php'] = <<<PHP
<?php

use Illuminate\\Support\\Facades\\Route;
use {$namespace}\\Http\\{$name}Controller;

Route::apiResource(
    '{$routeName}',
    {$name}Controller::class
);
PHP;

        // Web Routes
        $files['Routes/web.php'] = <<<PHP
<?php

use Illuminate\\Support\\Facades\\Route;

// Rotas web do módulo {$name}.
PHP;

        // Criar arquivos
        foreach ($files as $file => $content) {
            File::put("$path/$file", $content);
        }

        // Registrar rotas da API
        $this->registerApiRoutes($module, $name);

        $this->info("Módulo {$module}/{$name} criado com sucesso!");

        return self::SUCCESS;
    }

    private function registerApiRoutes(string $module, string $name): void
    {
        $routesFile = base_path('routes/api.php');

        if (!File::exists($routesFile)) {
            $this->warn('routes/api.php não encontrado.');
            return;
        }

        $require = "require_once app_path('Modules/{$module}/{$name}/Routes/api.php');";

        if (!str_contains(File::get($routesFile), $require)) {
            File::append($routesFile, "\n\n{$require}\n");
        }
    }
}
