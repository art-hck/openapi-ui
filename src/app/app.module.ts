import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { HighlightParameterPipe } from './pipes/highlight-parameter.pipe';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ParametersComponent } from "./components/parameters/parameters.component";
import { ContentComponent } from './components/content/content.component';
import { ReferenceComponent } from "./components/reference/reference.component";
import { IsReferenceDirective } from './directives/is-reference.directive';
import { NotReferenceDirective } from "./directives/not-reference.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { TryItComponent } from './components/try-it/try-it.component';
import { AsFormArrayPipe, AsFormControlPipe, AsFormGroupPipe } from "./pipes/abstract-control-converter.pipe";
import { HighlightJsDirective } from './directives/highlight-js.directive';
import { IconDirective } from './directives/icon.directive';
import { RlaScrollIntoViewDirective } from './directives/rla-scroll-into-view.directive';

@NgModule({
  declarations: [
    AppComponent,
    HighlightParameterPipe,
    SideMenuComponent,
    ParametersComponent,
    ContentComponent,
    ReferenceComponent,
    IsReferenceDirective,
    NotReferenceDirective,
    TryItComponent,
    AsFormGroupPipe,
    AsFormArrayPipe,
    AsFormControlPipe,
    HighlightJsDirective,
    IconDirective,
    RlaScrollIntoViewDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
