import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'; // tslint:disable-next-line:no-var-requires
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';

//MODULOS  DE FIREBASE
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';

/////////////////////////////////////////////////////////////////////////////777
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//COMPONENTES
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { SliderComponent } from './components/slider/slider.component';
import { SwiperModule } from 'swiper/angular';
import { ImagenesComponent } from './components/imagenes/imagenes.component';
import { provideStorage,getStorage } from '@angular/fire/storage'; // tslint:disable-next-line:no-var-requires
import { CartComponent } from './components/cart/cart.component';
import { FooterNavComponent } from './components/footer-nav/footer-nav.component';
// import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    ProductDetailComponent,
    AddProductComponent,
    SliderComponent,
    ImagenesComponent,
    CartComponent,
    FooterNavComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    SwiperModule,
    // AgmCoreModule.forRoot({
    //   // please get your own API key here:
    //   // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
    //   apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw'
    // }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())  
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

