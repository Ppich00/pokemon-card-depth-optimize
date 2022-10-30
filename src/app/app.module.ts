import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PokemonCardDirective } from './directive/pokemon-card.directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    PokemonCardDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
