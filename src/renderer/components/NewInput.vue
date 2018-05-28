<template>
  <div id="wrapper">
    <a href="/" class="back" title="Naciśnij, aby powrócić do bilansu!"></a>
    <div class="container-fluid">
      <div class="row mb-3 mt-5">
        <div class="col offset-2"><button @click="changeAdding(true)" class="w-100 btn btn-outline-success">Dodaj nowe aktywa</button></div>
        <div class="col"><button @click="changeAdding(false)" class="w-100 btn btn-outline-warning">Dodaj nowe pasywa</button></div>
      </div>
      <div class="row">
        <div class="col-2">
          <ul class="list-group">
            <li class="btn btn-info" @click="clearCurrently" ><h5 class="mt-2 text-center w-100 h-100">Utwórz nowy</h5></li>
            <li class="list-group-item" v-for="(unfinished, index) in $store.state.Balance.unfinished" @click="changeCurrentlyEditing(unfinished)">
              <h5 class="text-center">Edytuj numer {{ index + 1 }}</h5>
            </li>
          </ul>
        </div>
        <div class="col-5">
          <ul class="list-group">
            <li v-for="asset in assets" class="list-group-item list-group-item-success">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title text-center">{{ asset.name }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{{ asset.category.name }}</h6>
                  <h6 class="card-subtitle mb-2"> {{ asset.money }} PLN </h6>
                  <p class="card-text text-justify">{{ asset.desc }}</p>
                  <span @click="confirmRemoval(asset)" class="trash float-right"></span> <span @click="edit(asset)" class="mt-2 float-right mr-2 ml-2 edit"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-5">
          <ul class="list-group">
            <li v-for="liab in liabilities" class="list-group-item list-group-item-warning">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title text-center">{{ liab.name }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{{ liab.category.name }}</h6>
                  <h6 class="card-subtitle mb-2"> {{ liab.money }} PLN </h6>
                  <p class="card-text text-justify">{{ liab.desc }}</p>
                  <span @click="confirmRemoval(liab)" class="trash float-right"></span> <span @click="edit(liab)" class="mt-2 float-right mr-2 ml-2 edit"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="addingAsset || addingLiab">
        <label for="name">Nazwa rekordu</label>
        <input type="text" id="name" v-model="addingName" placeholder="Nazwa..." class="form-control mb-2 mt-2" data-toggle="tooltip" title="Tutaj wpisujesz nazwę!">
        <label for="desc">Opis rekordu</label>
        <input type="text" id="desc" v-model="addingDescription" placeholder="Opis..." class="form-control mb-2 mt-2" data-toggle="tooltip" title="Tutaj wpisujesz opis!">
        <h6 class="text-center"><span class="badge badge-info">Wybrana kategoria</span> {{ addingCategory.name }}</h6>
        <ul class="list-group" data-toggle="tooltip" title="Tutaj wybierasz kategorię!">
          <li v-if="addingAsset" v-for="category in $store.state.Balance.assetCategories" class="list-group-item list-group-item-success" @click="addingCategory = category">
            <h5 class="text-justify">{{ category.name }}</h5>
          </li>
          <li v-if="addingLiab" v-for="category in $store.state.Balance.liabCategories" class="list-group-item list-group-item-warning" @click="addingCategory = category">
            <h5 class="text-justify">{{ category.name }}</h5>
          </li>
        </ul>
        <label for="money" class="mt-2">Kwota</label>
        <input type="number" id="money" v-model="addingMoney" placeholder="Kwota..." class="form-control mb-2 mt-2" data-toggle="tooltip" title="Tutaj wpisujesz kwotę!">
        <span @click="addButtonListener" class="tick float-right" title="Naciśnij, aby dodać!"></span>
        <span @click="unAdd" class="cross float-right" title="Naciskając usuwasz obecny wpis!"></span>
      </div>
      <div class="modal" ref="editModal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            
            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Edycja</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <input type="text" v-model="editing.name" placeholder="Nazwa..." class="form-control mb-2 mt-2" data-toggle="tooltip" title="Tutaj zmieniasz nazwę!">
              <input type="text" v-model="editing.desc" placeholder="Opis..." class="form-control mb-2 mt-2" data-toggle="tooltip" title="Tutaj zmieniasz opis!">
              <input type="number" v-model="editing.money" placeholder="Kwota..." class="form-control mb-2 mt-2" data-toggle="tooltip" title="Tutaj zmieniasz kwotę!">
              <h6 v-if="editing !== ''" title="Wybrana kategoria" data-toggle="popover" data-trigger="hover" data-content="Kategorii nie można zmienić, aby to zrobić musisz usunąć ten rekord i dodać nowy">Kategoria: {{ editing.category.name }}</h6>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal" @click="editing = ''">Zamknij</button>
              <button @click="update" class="btn btn-outline-success" data-dismiss="modal">Zatwierdź zmiany</button>
            </div>

          </div>
        </div>
      </div>
      <div class="modal" ref="removeModal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            
            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Czy na pewno chcesz usunąć ten rekord?</h4>
              <button type="button" class="close" data-dismiss="modal" @click="toRemove = ''">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal" @click="toRemove = ''">Nie</button>
              <button @click="remove" class="btn btn-outline-danger" data-dismiss="modal">Tak</button>
            </div>

          </div>
        </div>
      </div>
      <div class="footer" v-if="!(addingLiab || addingAsset || editing !== '')">
        <button @click="save" class="w-100 btn btn-success disk"></button>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'add-or-edit',
    created () {
      // if (this.$store.state.Balance.assetCategories.length === 0) {
      //   this.$store.commit('SET_CATEGORIES')
      // }
      if (this.$store.state.Balance.unfinished.length === 0) {
        this.$store.dispatch('getUnfinished')
      }
    },
    mounted () {
      $('[data-toggle="tooltip"]').tooltip()
      $('[data-toggle="popover"]').popover()
    },
    methods: {
      save () {
        if (this.assets.length + this.liabilities.length === 0) {
          console.log(this.assets.length + this.liabilities.length)
          return false
        }
        if (this.currentlyEditing === '') {
          if (this.checkNum()) {
            this.addToVuex()
            // ....
            var index = this.$store.state.Balance.lastSavedNumber + 1 // this.$store.state.lastSavedNumber <-- Nazwy plików jako numery kolejnych
            this.$electron.ipcRenderer.send('add', {assets: this.assets, liabs: this.liabilities, index, unfinished: false})
            // this.$electron.ipcRenderer.on('reply', () => {
            // })
          } else {
            index = this.$store.state.Balance.lastUnfinishedNumber + 1
            var toAdd = {assets: this.assets, liabs: this.liabilities, index, unfinished: true}
            this.$electron.ipcRenderer.send('add', toAdd)
            this.$store.commit('ADD_INTERNAL', {where: this.$store.state.Balance.unfinished, toAdd})
          }
        } else {
          if (this.checkNum()) {
            this.addToVuex()
            // ....
            index = this.$store.state.Balance.lastSavedNumber + 1 // this.$store.state.lastSavedNumber <-- Nazwy plików jako numery kolejnych
            this.$electron.ipcRenderer.send('add', {assets: this.assets, liabs: this.liabilities, index, unfinished: false})
            this.$electron.ipcRenderer.on('saved', () => {
              this.$electron.ipcRenderer.send('remove', this.currentlyEditing.index)
              this.$store.commit('REMOVE_UNFINISHED', this.currentlyEditing)
            })
          } else {
            index = this.currentlyEditing.index
            this.$electron.ipcRenderer.send('add', {assets: this.assets, liabs: this.liabilities, index, unfinished: true})
          }
        }
        this.assets = []
        this.liabilities = []
      },
      checkNum () {
        var assetNum = 0
        this.assets.forEach((asset) => {
          assetNum += asset.money
        })
        var liabNum = 0
        this.liabilities.forEach((liab) => {
          liabNum += liab.money
        })
        return assetNum === liabNum
      },
      addToVuex () {
        this.assets.forEach((asset, index) => {
          this.addAsset(asset)
        })
        this.liabilities.forEach((liab) => {
          this.addLiab(liab)
        })
      },
      add (group) {
        if (this.addingCategory.name !== '' && this.addingName !== '' && this.addingMoney !== 0) {
          this.addingAsset = false
          this.addingLiab = false
          this.addingMoney = Number(this.addingMoney)
          group.push({money: this.addingMoney, name: this.addingName, category: this.addingCategory, desc: this.addingDescription})
          this.addingName = this.addingDescription = ''
          this.addingMoney = 0
          this.addingCategory = {name: ''}
        }
      },
      changeCurrentlyEditing (editing) {
        this.currentlyEditing = editing
        this.assets = editing.assets
        this.liabilities = editing.liabs
      },
      addAsset (item) {
        this.$store.commit('ADD_INTERNAL', {where: this.$store.state.Balance.assets[item.category.indexInGroup].subCategories[item.category.indexInSub].subtable, toAdd: {money: item.addingMoney, name: item.addingName, desc: item.addingDescription}})
      },
      addLiab (item) {
        console.log(this.$store.state.Balance.liabilities[item.category.indexInGroup].subCategories[item.category.indexInSub])
        this.$store.commit('ADD_INTERNAL', {where: this.$store.state.Balance.liabilities[item.category.indexInGroup].subCategories[item.category.indexInSub].subtable, toAdd: {money: item.addingMoney, name: item.addingName, desc: item.addingDescription}})
      },
      addButtonListener () {
        if (this.addingAsset) {
          this.add(this.assets)
        } else if (this.addingLiab) {
          this.add(this.liabilities)
        }
      },
      changeAdding (asset) {
        if (asset) {
          this.addingAsset = true
          this.addingLiab = false
        } else {
          this.addingAsset = false
          this.addingLiab = true
        }
        this.editing = ''
      },
      unAdd () {
        this.addingAsset = false
        this.addingLiab = false
        this.editing = ''
        this.addingName = this.addingDescription = ''
        this.addingMoney = 0
        this.addingCategory = {name: ''}
      },
      clearCurrently () {
        this.currentlyEditing = ''
        this.assets = []
        this.liabilities = []
      },
      edit (editing) {
        this.editing = editing
        this.addingAsset = false
        this.addingLiab = false
      },
      confirmRemoval (item) {
        this.toRemove = item
      },
      remove () {
        var index = this.assets.indexOf(this.toRemove)
        if (index === -1) {
          index = this.liabilities.indexOf(this.toRemove)
          this.liabilities.splice(index, 1)
        } else {
          this.assets.splice(index, 1)
        }
        this.toRemove = ''
      },
      update () {
        this.editing = ''
      }
    },
    data: () => {
      return {
        assets: [],
        liabilities: [],
        addingAsset: false,
        addingLiab: false,
        addingMoney: 0,
        addingCategory: {name: ''},
        addingName: '',
        addingDescription: '',
        currentlyEditing: '',
        toRemove: '' // This is for editing record
      }
    },
    watch: {
      toRemove (value) {
        if (value === '') {
          $(this.$refs.removeModal).modal('hide')
        } else {
          $(this.$refs.removeModal).modal('show')
        }
      }
    },
    computed: {
      editing: {
        get () {
          return this.$store.state.Balance.editing
        },
        set (value) {
          console.log('Emitted')
          if (value !== '') {
            value.money = Number(value.money)
            $(this.$refs.editModal).modal('show')
          } else {
            $(this.$refs.editModal).modal('hide')
          }
          this.$store.commit('EDIT_ONE_UNFINISHED', {value})
        }
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  @import "~bootstrap/dist/css/bootstrap.css";

  .button{
    background-image: -webkit-linear-gradient(top, #f4f1ee, #fff);
    background-image: linear-gradient(top, #f4f1ee, #fff);
    border-radius: 50%;
    box-shadow: 0px 8px 10px 0px rgba(0, 0, 0, .3), inset 0px 4px 1px 1px white, inset 0px -3px 1px 1px rgba(204,198,197,.5);
    float:left;
    height: 35px;
    margin: 0 30px 30px 0;
    position: relative;
    width: 35px;      
    -webkit-transition: all .1s linear;
    transition: all .1s linear;
  }
  .button:after {
    color:#e9e6e4;
    content: "";
    display: block;
    font-size: 30px;
    height: 20px;
    text-decoration: none;
    text-shadow: 0px -1px 1px #bdb5b4, 1px 1px 1px white;
    position: absolute;
    width: 20px;
  }
  .trash:after{
    content: url(~@/assets/trash-can-closed.png);
    left: 6.5px;
    top: 8px;
  }
  .edit:after{
    content: url(~@/assets/pencil-edit-button.png);
    left: 5.5px;
    top: 10px;
  }
  .back:after{
    content: url(~@/assets/back.png);
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .tick:after{
    content: "✔";
    font-size: 35px;
    left: -15px;
    top: 15px;
  }
  .disk:after{
    content: url(~@/assets/save-file-option.png);
    font-size: 35px;
    left: 5px;
    top: 5px;
  }
  .cross:after{
    content: "✖";
    font-size: 35px;
    position: relative;
    left: -15px;
    top: 0px;
  }
  .button:hover{
    background-image: -webkit-linear-gradient(top, #fff, #f4f1ee);
    background-image: linear-gradient(top, #fff, #f4f1ee);
    color:#0088cc;
  }
  .trash:hover:after{
    content: url(~@/assets/trash-can.png);
    text-shadow:0px 0px 6px #f94e66;
  }
  .edit:hover:after{
    content: url(~@/assets/pencil-edit-button-colored.png);
    text-shadow:0px 0px 6px #f94e66;
  }
  .back:hover:after{
    content: url(~@/assets/back-colored.png);
    text-shadow:0px 0px 6px #f94e66;
  }
  .disk:hover:after{
    content: "Zapisz";
    text-shadow:0px 0px 6px #f94e66;
  }
  .tick:hover:after{
    color:#83d244;
    text-shadow:0px 0px 6px #83d244;
  }
  .cross:hover:after{
    color:#eb2f2f;
    text-shadow:0px 0px 6px #eb2f2f;
  }
  .footer {
    position: absolute;
    bottom: 10px;
    width: 98.5%;
  }
</style>
