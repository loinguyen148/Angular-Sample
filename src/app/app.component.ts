import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Hero { name: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  heroes: Observable<Hero[]>;
  selectedHero: Hero;
  private heroesCollection: AngularFirestoreCollection<Hero>;
  
  constructor(db: AngularFirestore) {
    this.heroesCollection = db.collection<Hero>('heroes');
    this.heroes = db.collection<Hero>('heroes').valueChanges();
  }
  
  selectHero(hero: Hero) {
    this.selectedHero = hero;
  }
  
  addHero(heroName: string) {
    if (heroName && heroName.trim().length) {
      const newHero: Hero = {
        name: heroName
      };
      
      this.heroesCollection.add(newHero);
    }
  }
  
  updateHero(hero: Hero) {
    console.warn(this.selectedHero);
    // this.heroesCollection.doc(this.selectedHero.name).update({ name: 'updated name' });
    this.heroesCollection.doc(this.selectedHero.name).update({ name: 'updated name' });
  }
  
  deleteHero(hero: Hero) {
    this.heroesCollection.doc(hero.name).delete();
  }
}
