import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'; // tslint:disable-next-line:no-var-requires
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
// import { IonicStorageModule } from '@ionic/storage-angular'
import { Storage } from '@ionic/storage';
//MODULOS  DE FIREBASE
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { getMessaging, getToken } from '@firebase/messaging';

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
import { CartComponent } from './components/cart/cart.component';
import { FooterNavComponent } from './components/footer-nav/footer-nav.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { OrdersComponent } from './components/orders/orders.component';
import { HistoryOrdersComponent } from './components/history-orders/history-orders.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductsSearchedComponent } from './components/products-searched/products-searched.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

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
    CartComponent,
    FooterNavComponent,
    EditProductComponent,
    OrdersComponent,
    HistoryOrdersComponent,
    CategoryComponent,
    ProductsSearchedComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    // IonicStorageModule.forRoot(),
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
    provideStorage(() => getStorage()),
  ],
  providers: [
    Storage,
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

