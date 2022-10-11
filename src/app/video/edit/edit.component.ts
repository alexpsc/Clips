import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  inSubmission = false
  showAlert = false
  alertColor = "blue"
  alertMsg = "Please wait! Updating Clip"

  @Output() update = new EventEmitter()

  clipId = new FormControl("")

  title = new FormControl("", {
    validators:
      [Validators.required,
      Validators.minLength(3)
      ],
    // nonNullable:true
  })
  editForm = new FormGroup({
    title: this.title,
    id: this.clipId
  })

  constructor(private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.modal.register("editClip")
  }

  ngOnDestroy(): void {
    this.modal.unregister("editClip")
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return
    }
    this.inSubmission = false
    this.showAlert = false
    this.clipId.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  async submit() {
    if (!this.activeClip) { return }
    this.inSubmission = true
    this.showAlert = true
    this.alertColor = "blue"
    this.alertMsg = "Please wait! Updating Clip"
    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value)
    }
    catch (e) {
      this.inSubmission = false
      this.alertColor = "red"
      this.alertMsg = "Something went wrong, try again later"
      return
    }
    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = "green"
    this.alertMsg = "Success!"



  }
}
