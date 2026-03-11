import { Component, inject, OnInit, signal } from '@angular/core';
import { S3Upload } from '../../services/s3-upload';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {

  file!: File;

  private uploadService = inject(S3Upload);

  selectedFile = signal<File | null>(null);
  s3Url = signal<string>('');      // actual image from S3
  previewUrl = signal<string>(''); // local preview
  uploading = signal<boolean>(false);

  key = signal<string>('uploads/profile-picture');

  ngOnInit(): void {
    this.fetchImage();
  }

  private fetchImage(){
     this.uploadService.getImageUrl(this.key()).subscribe(url => {
      this.s3Url.set(url);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile.set(file);
    const localUrl = URL.createObjectURL(file);
    this.previewUrl.set(localUrl);
  }

  upload() {
    this.uploading.set(true);

    this.uploadService.getPresignedUrl(this.selectedFile()!)
      .pipe(
        switchMap((res: any) => {
          return this.uploadService.uploadToS3(res.url, this.selectedFile()!)
        })
      )
      .subscribe({
        next: () => {
          this.s3Url.set(this.previewUrl());
          this.previewUrl.set(''); // clear preview after successful upload
          this.uploading.set(false);
        },
        error: () => {
          this.previewUrl.set(''); // clear preview on error as well
          this.uploading.set(false);
        }
      });
  }

}