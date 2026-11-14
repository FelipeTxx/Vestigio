import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  chevronBackOutline,
  chevronDownOutline,
  chevronForwardOutline,
  chevronUpOutline,
  closeOutline,
  cubeOutline,
  gridOutline,
  homeOutline,
  logOutOutline,
  menuOutline,
  personOutline
} from 'ionicons/icons';
import { filter, skip } from 'rxjs';
import { AuthService } from './services/auth.service';
import { NAVIGATION_SECTIONS, NavigationSection } from './navigation/navigation.config';

type SidebarMode = 'expanded' | 'compact' | 'hidden';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent implements OnInit {
  readonly sections = NAVIGATION_SECTIONS;
  sidebarMode: SidebarMode = 'expanded';
  readonly showWorkspace = signal(false);
  readonly currentUser = signal<any>(null);
  collapsedSections: Record<string, boolean> = {};
  userMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({
      bookOutline,
      chevronBackOutline,
      chevronDownOutline,
      chevronForwardOutline,
      chevronUpOutline,
      closeOutline,
      cubeOutline,
      gridOutline,
      homeOutline,
      logOutOutline,
      menuOutline,
      personOutline
    });
  }

  ngOnInit(): void {
    this.updateWorkspaceVisibility(this.router.url);
    this.authService.sessionState$.pipe(skip(1)).subscribe(isAuthenticated => {
      this.showWorkspace.set(isAuthenticated);
      if (!isAuthenticated) {
        this.currentUser.set(null);
        this.closeUserMenu();
      }
    });
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => this.updateWorkspaceVisibility(event.urlAfterRedirects));
  }

  get visibleSections(): NavigationSection[] {
    return this.sections.filter(section => section.items.length > 0);
  }

  get isWorkspaceVisible(): boolean {
    return this.showWorkspace();
  }

  get shouldShowReopenButton(): boolean {
    return this.isWorkspaceVisible && this.sidebarMode === 'hidden';
  }

  get initials(): string {
    const user = this.currentUser();
    const name = user?.name?.trim() || user?.email?.trim() || 'US';
    const words = name.split(/\s+/).filter(Boolean);
    return words.length > 1
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  }

  get displayName(): string {
    const user = this.currentUser();
    return user?.name || user?.email || 'Sua conta';
  }

  toggleSection(sectionId: string): void {
    this.collapsedSections[sectionId] = !this.isSectionCollapsed(sectionId);
  }

  isSectionCollapsed(sectionId: string): boolean {
    return this.collapsedSections[sectionId] ?? false;
  }

  setSidebarMode(mode: SidebarMode): void {
    this.sidebarMode = mode;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout()
    });
  }

  private updateWorkspaceVisibility(url: string): void {
    this.showWorkspace.set(!url.startsWith('/login'));
    this.closeUserMenu();

    if (!this.showWorkspace()) {
      return;
    }

    this.currentUser.set(this.authService.getCurrentUser());
    if (!this.currentUser() && this.authService.isLoggedIn()) {
      this.authService.me().subscribe({
        next: user => this.currentUser.set(user),
        error: () => this.currentUser.set(null)
      });
    }
  }

  private finishLogout(): void {
    this.currentUser.set(null);
    void this.router.navigate(['/login']);
  }
}
