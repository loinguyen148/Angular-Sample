import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Hero { id: string, name: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tour of Heroes';
  heroes: Observable<Hero[]>;
  selectedHero: Hero;
  private heroesCollection: AngularFirestoreCollection<Hero>;
  
  constructor(private db: AngularFirestore) {
    
  }
  
  ngOnInit(): void {
    this.getHeroes();
    this.heroes.subscribe(hero => {
      console.warn(hero);
    });
  }
  
  getHeroes(): void {
    this.heroesCollection = this.db.collection<Hero>('heroes');
    this.heroes = this.db.collection<Hero>('heroes').valueChanges();
  }
  
  selectHero(hero: Hero) {
    this.selectedHero = hero;
  }
  
  addHero(heroName: string) {
    if (heroName && heroName.trim().length) {
      const id = this.db.createId();
      const hero: Hero = {
        id,
        name: heroName
      };
      
      this.heroesCollection.doc(id).set(hero).then(() => {  
        console.log("Document successfully added!");
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
      // this.heroesCollection.doc(id).set(hero); // Another way to add new item
    }
  }
  
  updateHero(hero: Hero) {
    if (hero) {
      hero.name = 'Updated ' + hero.name;
      this.heroesCollection.doc(hero.id).update(hero);
      const currentHero: any = this.heroesCollection.doc(hero.id).ref.get();
      
      console.warn(currentHero.__zone_symbol__value.id);
    }
  }
  
  deleteHero(hero: Hero) {
    if (hero) {
      this.heroesCollection.doc(hero.id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    
    this.selectedHero = {} as Hero;
    }
  }
}
