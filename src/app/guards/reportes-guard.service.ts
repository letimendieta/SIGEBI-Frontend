import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../servicios/token.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesGuardService implements CanActivate {

  realRol = [];
  autorized : boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.autorized = false;
    this.realRol = [];
    const expectedRol = route.data.expectedRol;
    const roles = this.tokenService.getAuthorities();
    this.realRol.push('user');
    roles.forEach(rol => {
      if( rol === 'ROL_ADMIN' ) {
        this.realRol.push('admin');
      }
      if( rol === 'ROL_REPORTES' ){
        this.realRol.push('reportes');
      }     
    });
    
    this.realRol.forEach( real => {
      if( expectedRol.indexOf(real) > -1 ){
        this.autorized = true;
      }
    })

    if (!this.tokenService.getToken() || !this.autorized ) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}