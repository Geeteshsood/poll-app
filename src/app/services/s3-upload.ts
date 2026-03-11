import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class S3Upload {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/app';

  getPresignedUrl(file: File) {
    return this.httpClient.get<any>(
      `${this.baseUrl}/s3/presigned-url?fileName=${file.name}&contentType=${file.type}`
    );
  }

  uploadToS3(url: string, file: File) {
    return this.httpClient.put(url, file, {
      headers: {
        'Content-Type': file.type
      }
    });
  }

   getImageUrl(key: string) {
    return this.httpClient.get(`${this.baseUrl}/s3/get-image?key=${key}`, { responseType: 'text' });
  }
}
