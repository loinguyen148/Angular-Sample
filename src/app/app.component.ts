import { Component, OnInit, OnChanges, OnDestroy, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, DoCheck } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Hero {
  id: string;
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Tour of Heroes';
  heroDetails: Object = {};
  selectedHero: Hero;
  private heroesCollection: AngularFirestoreCollection<Hero>;
  myHeroes: Hero[];
  private x = 5;
  
  constructor(private db: AngularFirestore) {
  }
  
  ngOnInit(): void {
    this.getHeroes();
    /* this.heroes.subscribe(heroes => {
      console.warn(heroes);
    }); */
    
    // this.coldObservable();
    // this.hotObservable();
  }
  
  coldObservable():void {
    const observable = Observable.create(observer => {
      let x = 5;
      observer.next(x);
      x += 10;
      
      setTimeout(() => {
        observer.next(x);
        observer.complete();
      }, 1000);
    });
    
    const observer = {
      next: value => console.warn(value),
      complete: () => console.warn('done')
    };
    
    observable.subscribe(observer);
    
    setTimeout(() => {
      observable.subscribe(observer);
    }, 1000);
  }
  
  hotObservable():void {
    const observable = Observable.create(observer => {
      observer.next(this.x);
      this.x += 10;
      
      setTimeout(() => {
        observer.next(this.x);
        observer.complete();
      }, 1000);
    });
    
    const observer = {
      next: value => console.warn(value),
      complete: () => console.warn('done')
    };
    
    observable.subscribe(observer);
    
    setTimeout(() => {
      observable.subscribe(observer);
    }, 1000);
  }
  
  getHeroes(): void {
    this.heroesCollection = this.db.collection<Hero>('heroes');
    this.heroesCollection.valueChanges().subscribe(heroes => {
      this.myHeroes = heroes;
    })
  }
  
  getHero(heroId: string): void {
    this.heroesCollection.doc(heroId).ref.get().then((doc) => {
      if (doc.exists) {
        this.heroDetails = doc.data();
        console.log("Document data:", doc.data());
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
  
  onSelectHero(hero: Hero) {
    this.selectedHero = hero;
    this.getHero(this.selectedHero.id);
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
      this.heroesCollection.doc(hero.id).update(hero);
      this.selectedHero = {} as Hero;
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
  
  onChangeHeroName(heroName: string) {
    this.selectedHero.name = heroName;
  }
  
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.myHeroes, event.previousIndex, event.currentIndex);
  }
}