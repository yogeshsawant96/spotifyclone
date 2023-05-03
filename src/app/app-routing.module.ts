import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { SongCardComponent } from './shared/song-card/song-card.component';

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'search',
    component:SearchComponent
  },
  {
    path:'playlist/:id',
    component:PlaylistComponent
  },
  {
    path:'**',
    component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
