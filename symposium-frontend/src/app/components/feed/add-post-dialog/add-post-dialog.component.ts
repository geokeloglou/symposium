import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-post-dialog',
  templateUrl: './add-post-dialog.component.html',
  styleUrls: ['./add-post-dialog.component.sass']
})
export class AddPostDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddPostDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      text: ['', Validators.required],
      postImage: ['']
    });
  }

  onFileChange(event: any): void {
    this.form.controls.postImage.setValue(event.target.files[0]);
  }

  save(): void {
    if (!this.errorExists()) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  errorExists(): boolean {
    return this.form.get('text')?.value.replace(/\s/g, '') === '';
  }

}
