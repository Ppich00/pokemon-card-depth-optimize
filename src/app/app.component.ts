import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {PokemonCardDirective} from "./directive/pokemon-card.directive";
import { ScullyLibModule } from '@scullyio/ng-lib';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, PokemonCardDirective, ScullyLibModule ,HttpClientModule ],
  providers: [ HttpClientModule ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'pokemon-card-depth';
  testHello() {
    console.count('hello');
  }
}
