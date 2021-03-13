import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlidesPage } from './slides.page';

describe('SlidesPage', () => {
  let component: SlidesPage;
  let fixture: ComponentFixture<SlidesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
