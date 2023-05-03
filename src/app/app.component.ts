import { ListKeyManager } from '@angular/cdk/a11y';
import { Location } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spotifyClone';
  mainRouter:Router | undefined;
  webViewSrc:any;
  isToken = false;
  isPlaying:boolean = false;
  song = new Audio();
  playList:any=[];
  albums:any=[];
  selectedSong:any;
  selectedPlayList:any;
  selectedIndex:number=0;
  categories:any[]=[
    {
      type:'album',
      selected:false
    },
    {
      type:'artists',
      selected:false
    }
  ];

  constructor(private _AuthService:AuthService,private _location: Location)
  {}

  async ngOnInit()
  {
    await this._AuthService.authorize().subscribe((response:any)=>{
      this._AuthService.setToken(response.access_token);

      //GET NEW RELEASES
      this.isToken=true;
      this._AuthService.getNewRelease().subscribe((newSongs:any)=>{
        console.log(newSongs.albums.items[0]);
        this.albums=newSongs.albums.items;
      });

      //GET CATEGORIES
      // this._AuthService.getCategories().subscribe((categories)=>{
      //   console.log(categories);
      // });


      //GET PLAYLIST
      this._AuthService.getFeaturedPlaylist().subscribe((list)=>{
        console.log(list);
        this.playList=list;
      })

      //SONG OBSERVALES : TO PLAY & PAUSE SONGS
      this._AuthService.getPlayer().subscribe((song)=>{
        if(song)
        {
          this.isPlaying=true;
          this.play(song);
        }
      });

    });

    //GET SELECTED SONG ENTIRE PLAYLIST
    this._AuthService.getSelectedPlayList().subscribe((list)=>{
      this.selectedPlayList = list;
      console.log(list);
    });

    //GET SELECTED SONG INDEX
    this._AuthService.getSelectedIndex().subscribe((index:number)=>{
      this.selectedIndex = index;
      console.log(this.selectedPlayList[index].preview_url);
      this.play(this.selectedPlayList[index]);
    })
  }



    sort(cat:number)
    {
      this.categories[cat].selected=true;
      this._AuthService.filter(this.categories[cat].type);
    }

    remove(i:number){
      this.categories[i].selected=false;
    }


    play(song:any)
    {
      if(this.isPlaying)
      {
        this.song.pause();
      }
      this.song.src=song.preview_url;
      this.selectedSong = song.name;
      this.song.play();
    }

    pause()
    {
      if(this.isPlaying)
      {
        this.song.pause();
        this.isPlaying=false;
      }else{
        this.play(this.selectedPlayList[this.selectedIndex]);
        this.isPlaying=true;
      }
    }



    prevSong(){
      if(this.selectedIndex>0){
        this.selectedIndex--;
        this.play(this.selectedPlayList[this.selectedIndex]);
        this._AuthService.setCurrentPlayingSong(this.selectedIndex);
       }
    }

    nextSong(){
      if(this.selectedIndex<this.selectedPlayList.length-1){
        this.selectedIndex++;
        this.play(this.selectedPlayList[this.selectedIndex]);
        this._AuthService.setCurrentPlayingSong(this.selectedIndex);
      }
  }

    prev()
    {
      this._location.back();
    }

    next()
    {
      this._location.forward();
    }

}
