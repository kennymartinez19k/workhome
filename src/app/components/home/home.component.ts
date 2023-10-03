import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { SwiperOptions } from 'swiper';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

products: any[] = []
user: any = {}
showSuccessMsg = false
searchTerm: string = ''
searchProduct: any[] = []

  constructor(private router: Router, private productService: ProductService, 
    private alert: AlertController, private storageService: StorageService,
    private cartService: ShoppingCartService, private cdRef: ChangeDetectorRef){
    this.products = [{
      nombre: "",
      precio: 0,
      stock: 0,
      img: "",
      qty: 0,
      categoryId: ""
    }]
  }

  config: SwiperOptions = {
    slidesPerView: 2,
    scrollbar: { draggable: true },
    autoplay:{
      delay: 1000,
      disableOnInteraction: false,
    },
    
    loop:true
  };

   async ngOnInit() {
    this.cdRef.detectChanges()

    this.productService.getProduct().subscribe(products => {
      this.products = products
      products.forEach(product => {
        if(!product.img){
          product.img = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw4QERAPDg4VFREQEhkXEBcYFxUXFRURFxEXFxYTFRUYICggGB0lGxMVITEhJSkrLi86Fx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIALcBEwMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAwIBB//EAEcQAAEDAgQDAwgFCQUJAAAAAAEAAgMEEQUSITETQVEGInEUMjRSYYGRskJzoaPRFRYjVFVik7HwcpLBw/EHMzVDU2N0lKL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/TEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERUU3aeLM5kMM0+Q2cYmFzQel+aC9RZ/8AOZ37OrP4R/FPzmd+zqz+EfxQaBc5pmMGZ7g1o5kgD4lVmH42ZpBGaOpjuCc0keVosOZuoUuHGoqaiSqie6GnAFPGQcrzlu5wH0jy946ILf8AK9L+sxf32/ivUWJU7yGsnjJOwD2knwF1mfKKT9iT/wDrqRSUNHVZ4jhksHduHuj4djewyu687exBqUWVwzGqiCPg1FHVSPjcWh7YiQ5oNmm5305q4wrGoaguY0OZIzz43jK8DrZBZIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIIONvLaaoc02IifbxylQMOqoaSggkcDl4bDZouXSPAOg5kkqb2g9FqfqX/KVFo6COooaeKS9jDGQQbEODAQ4FBKwjFWVIflY5j43WkY8Wc0kXGisFX4RhMdMH5XOe6R15HvN3OPK59isEBR62sihaZJpAxo5nmeg6n2LpUTNja6R5s1jS5x9gFyscZmuaMQrGGR8rstDBuAL902687/iEFqO1LHaw0tRI31mx6HwXei7S00juG4uikOzZW5CfA7KA/wAuJbx8Qip3vtkia1pOuwJcbk8ua54g6VmW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"
        }
        if(!product.qty){
          product.qty = 1
        }
      })
    })
    
   this.user = await this.storageService.get("usuario")
   console.log(this.user)
  }

  editProduct(product: Product) {
    if(product.uid) {
      this.router.navigate(['/edit-product', product.uid])
    } else {
      alert("el uid es null o undefined")
    }
  }

  deleteProduct(uid: string): void {
    this.productService.deleteProduct(uid).then( () => {
      this.products = this.products.filter(product => product.uid !== uid)
      this.cdRef.detectChanges();
    })
    .catch(error => {
      console.log("error eliminar producto", error)
    })
  }

  async confirmDelete(uid: string) {
    const alert = await this.alert.create({
      header: 'Eliminar el producto',
      message: '¿Está seguro de eliminar el producto?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {alert.dismiss()}
      },
    {
      text: 'Eliminar',
      handler: () => {
        this.deleteProduct(uid)}
    }]
    })
    await alert.present()
  }

 addToCart(product: any): void {
  this.cartService.addProductCart(product)
  this.showSuccessMsg = true

  setTimeout(() => {
    this.showSuccessMsg = false
  }, 1000)
 }

 async searchProducts() {
  this.productService.searchProducts(this.searchTerm)
  this.router.navigate(['/search-results'])
 }

}

