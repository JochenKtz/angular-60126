import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injectable, Injector, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';

@Injectable()
class TestService { }

@Component({
  standalone: false,
  template: '<div>Dynamic</div>',
})
class DynamicComponent {
  constructor(private testService: TestService) { }
}

@Component({
  standalone: false,
  template: '<div>Child</div>',
})
class ChildComponent implements OnInit {
  constructor(
    private host: ElementRef<HTMLElement>,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    protected testService: TestService
  ) { }

  public ngOnInit() {
    const portalOutlet = new DomPortalOutlet(
      this.host.nativeElement,
      this.componentFactoryResolver,
      this.appRef,
      this.injector,
    );
    const componentPortal = new ComponentPortal(DynamicComponent, null, this.injector);
    portalOutlet.attach(componentPortal);
  }
}

@NgModule({
  declarations: [ChildComponent],
  providers: [TestService],
  imports: [RouterModule.forChild([{ path: '', component: ChildComponent }])],
})
class ChildModule { }

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div>Root</div>
    <router-outlet />
  `,
})
export class PlaygroundComponent { }

@NgModule({
  declarations: [PlaygroundComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{ path: '', loadChildren: () => ChildModule }])
  ],
  bootstrap: [PlaygroundComponent],
})
class TestModule { }

platformBrowserDynamic().bootstrapModule(TestModule);
