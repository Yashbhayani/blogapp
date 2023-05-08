import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogservicesService } from 'src/app/services/blogservices.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
// @Pipe({ name: 'replaceLineBreaks' })
export class BlogComponent {
  blog: any;
  user: any;
  constructor(
    private activatedrouter: ActivatedRoute,
    private api: BlogservicesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  Username: any = null;
  fllatter: any = null;
  UserId: any;
  name: any = null;
  id: any = null;
  Usernamejs: any;
  Userinfo: any;

  ngOnInit(): void {
    this.id = this.activatedrouter.snapshot.paramMap.get('id');
    if (
      this.activatedrouter.snapshot.paramMap.get('id') === null ||
      this.activatedrouter.snapshot.paramMap.get('id') === undefined
    ) {
      this.router.navigate(['/']);
    } else {
      let ki: any = localStorage.getItem('Userinfo');
      this.Usernamejs = `${JSON.parse(ki).Firstname} ${JSON.parse(ki).surname}`;
      this.getallfunction();
    }
  }

  getallfunction() {
    let Authtoken = localStorage.getItem('token');
    this.api.getblogsid(Authtoken, this.id).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.blog === undefined || res.blog.Blog_content.length === 0) {
            this.router.navigate(['/']);
            this.toastr.warning('Blogs not found', 'Unsuccesfull');
          } else {
            this.blog = res.blog;
            this.user = res.user;
            this.Userinfo = res.userio;
            this.UserId = res.userio._id;
            this.Username = `${this.user.Firstname} ${this.user.surname}`;
            this.fllatter = `${this.user.Firstname.slice(
              0,
              1
            )}${this.user.surname.slice(
              0,
              1)}`;
          }
        } else {
          this.router.navigate(['/']);
          this.toastr.warning(res.errors.code, res.errors.response);
        }
      },
      error: (er) => {
        this.router.navigate(['/']);
        this.toastr.error(er.statusText, er.error.errors);
      },
    });
  }
}
