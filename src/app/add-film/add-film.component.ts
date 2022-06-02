import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FilmService } from '../service/film.service';

@Component({
  selector: 'app-add-film',
  templateUrl: './add-film.component.html',
  styleUrls: ['./add-film.component.css']
})
export class AddFilmComponent implements OnInit {

  form: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private filmService: FilmService) { 
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      synopsis: [''],
      poster: [''],
      budget: [''],
      release: [''],
      all_ages: true,
      production: this.formBuilder.group({
        producer: '',
        country: ''
      }),
      cast: this.formBuilder.array([
        this.formBuilder.group({
          actor: '',
          role: ''
        })
      ]),
      genres: this.formBuilder.array(['']),
    });
  }

  ngOnInit(): void {
  }

  onArrayChanged(event: any) {
    var content = (event.target.value as string).split(',');
    var array = (this.form.controls['genres'] as FormArray)
    array.clear();
    content.forEach((item) => {
      if(item.startsWith(' '))
        item = item.slice(1);
      array.push(this.formBuilder.control(item));
    }) 
  }

  retrieveFormControls() {
    return this.retrieveFormArray().controls;
  }

  retrieveFormArray(): FormArray {
    var form = this.form.get('cast');
    return form as FormArray;
  }

  removePostFormArrayItem(idx: number) {
    (this.form.controls['cast'] as FormArray).removeAt(idx);
  }

  retrieveFormGroup(idx: number): FormGroup {
    var form = this.form.get('cast');
    if(form instanceof FormArray) {
      return form.at(idx) as FormGroup;
    } 
    return form as FormGroup;
  }

  addFormArrayItem(idx: number) {
    var form = this.form.get('cast') as FormArray;
    var formGroup = this.formBuilder.group({});
    for(const control in this.retrieveFormGroup(idx).controls) {
      formGroup.addControl(control, this.formBuilder.control(''));
    }
    form.push(this.formBuilder.group(formGroup.value));
  }

  booleanChanged(value: boolean) {
    this.form.controls['all_ages'].setValue(value);
  }

  postFilm() {
    this.filmService.postFilm(
      {
        title: this.form.value.title,
        synopsis: this.form.value.synopsis,
        poster: this.form.value.poster,
        budget: this.form.value.budget,
        release: this.form.value.release,
        all_ages: this.form.value.all_ages,
        production: this.form.value.production,
        cast: this.form.value.cast,
        genres: this.form.value.genres,
      }
    ).subscribe(data => {
      Swal.fire({
        title: "La película se ha añadido con éxito",
        text: "Puedes consultarla en la página principal",
        icon: 'success',
        showConfirmButton: true,
        confirmButtonColor: "#1eb300",
        confirmButtonText: "Volver al menú principal"
      }).then(() => {
        this.router.navigate(['']);
      })
    },
      (error: HttpErrorResponse) => {
        Swal.fire({
          title: "Se ha producido un error al añadir la película",
          text: "Por favor, comprueba los datos suministrados e inténtalo de nuevo",
          icon: 'error',
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: "Volver",
        })
      })
  }

}
