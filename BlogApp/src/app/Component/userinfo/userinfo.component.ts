import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css'],
})
export class UserinfoComponent {
  name: any = null;
  id: any = null;
  Username: any;
  Authtoken: any;
  USER = new Array();
  BlogsContent: any;
  BlogPost: any;
  Userdata: any;
  constructor(
    private activatedrouter: ActivatedRoute,
    private api: BlogservicesService,
    private toastr: ToastrService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.name = this.activatedrouter.snapshot.paramMap.get('name');
    this.id = this.activatedrouter.snapshot.paramMap.get('id');
    if (
      this.activatedrouter.snapshot.paramMap.get('id') === null ||
      this.activatedrouter.snapshot.paramMap.get('id') === undefined
    ) {
      this.router.navigate(['/']);
    } else {
      this.Userinfomation();
   
    }

  }

  Userinfomation() {
    this.Authtoken = localStorage.getItem('token');
    this.api.OtherUserdataget(this.Authtoken, this.id).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.user._id === this.id) {
            this.router.navigate(['/user']);
          } else {
            this.BlogPost = res.UDATA.BlogPost;
            this.Userdata = res.user;
            this.USER.push(res.UDATA);
            this.BlogsContent = res.blog;
          }
        } else {
          this.router.navigate(['/']);
          this.toastr.warning(res.error);
        }
      },
      error: (er) => {
        this.router.navigate(['/']);
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }

}
