import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SavedLocationsComponent } from './saved-locations/saved-locations.component';

export const routes: Routes = [
    { path: '', component: WeatherComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'weather/all', component: SavedLocationsComponent }
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule { }