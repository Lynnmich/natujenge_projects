import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SavedLocationsComponent } from './saved-locations/saved-locations.component';
import { WeatherDetailsComponent } from './weather-details/weather-details.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component'

export const routes: Routes = [
    { path: '', component: WeatherComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'weather/all', component: SavedLocationsComponent },
    { path: '**', redirectTo: '/favorites' },
    { path: 'weather-details', component: WeatherDetailsComponent }
];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],

  })
  export class AppRoutingModule { }