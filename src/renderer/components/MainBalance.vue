<template>
  <div class="container-fluid">
    <div class="row mt-4 mb-2">
      <ul class="list-group">
        <li class=""></li>
        <li class="list-group-item" v-for="balance in $store.state.Balance.balances"></li>
      </ul>
    </div>
    <div class="row mt-4">
      <div class="col">
        <ul id="assets" class="table table-border"> 
          <li class="list-group-item list-group-item-success text-center"><h2>Aktywa</h2></li>  
          <li v-for="(asset, index) in $store.state.Balance.assets" class="list-group-item">
            <div><h3 class="text-center">{{ asset.name }}</h3><span @click="open(asset)" class="expand float-right moveUp" title="Naciśnij, aby rozwinąć!"></span></div>
            <ul class="list-group">
              <li v-if="asset.opened" v-for="(subAsset, subIndex) in asset.subCategories" class="list-group-item list-group-item-success">
                <h5 class="float-left">{{subAsset.name}}</h5><span @click="open(subAsset)" class="float-right" :class="{expandable: subAsset.subtable.length == 0, expand: subAsset.subtable.length > 0}" title="Naciśnij, aby rozwinąć!"></span>
                <ul class="list-group float-left w-100">
                  <li v-if="subAsset.opened" v-for="record in subAsset.subtable" class="list-group-item">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title text-center">{{ record.name }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ subAsset.name }}</h6>
                        <h6 class="card-subtitle mb-2 mt-2">{{ record.money }} PLN</h6>
                        <p class="card-text">{{ record.desc }}</p>
                      </div>
                    </div>
                  </li>
                  <li v-if="subAsset.opened" class="list-group-item">Suma z kategorii: <div class="text-uppercase text-success">{{subAsset.name}}</div> <h4 class="text-center text-success">{{getSum(subAsset.subtable)}} PLN</h4></li>
                </ul>
              </li>
              <li v-if="asset.opened" class="list-group-item border-success">Suma z kategorii: <div class="text-uppercase text-success">{{asset.name}}</div> <h4 class="text-center text-success">{{ getSumGroup(asset) }} PLN</h4></li>
            </ul>
          </li>
          <li class="list-group-item list-group-item-success">Suma aktywów: <h4 class="text-center"> {{ assetsSum }} PLN </h4></li>
        </ul>
      </div>
      <div class="col">
        <ul id="liabs" class="table table-border">
          <li class="list-group-item list-group-item-warning text-center"><h2>Pasywa</h2></li>
          <li v-for="(liab, index) in $store.state.Balance.liabilities" class="list-group-item">
            <div><h3 class="text-center">{{ liab.name }}</h3><span @click="open(liab)" class="expand float-right moveUp" title="Naciśnij, aby rozwinąć!"></span></div>
            <ul class="list-group">
              <li v-if="liab.opened" v-for="(subLiab, subIndex) in liab.subCategories" class="list-group-item list-group-item-warning">
                <h5 class="float-left mr-4">{{subLiab.name}}</h5><span @click="open(subLiab)" class="float-right" :class="{expandable: subLiab.subtable.length == 0, expand: subLiab.subtable.length > 0}" title="Naciśnij, aby rozwinąć!"></span>
                <ul class="list-group float-left w-100">
                  <li v-if="subLiab.opened" v-for="record in subLiab.subtable" class="list-group-item">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title text-center">{{ record.name }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ subLiab.name }}</h6>
                        <h6 class="card-subtitle mb-2 mt-2">{{ record.money }} PLN</h6>
                        <p class="card-text">{{ record.desc }}</p>
                      </div>
                    </div>
                  </li>
                  <li v-if="subLiab.opened" class="list-group-item">Suma z kategorii: <div class="text-uppercase text-warning">{{subLiab.name}}</div> <h4 class="text-center text-warning">{{getSum(subLiab.subtable)}} PLN</h4></li>
                </ul>
              </li>
              <li v-if="liab.opened" class="list-group-item border-warning">Suma z kategorii: <div class="text-uppercase text-warning">{{liab.name}}</div> <h4 class="text-center text-warning">{{ getSumGroup(liab) }} PLN</h4></li> 
            </ul>   
          </li>
          <li class="list-group-item list-group-item-warning">Suma pasywów: <h4 class="text-center"> {{ liabsSum }} PLN </h4></li>
        </ul>
      </div>
    </div>
   <div class="row mt-3">
    <div class="col-6 offset-3">
      <a href="#/change" class="btn btn-outline-success w-100" style="margin: auto;" title="Naciśnij, aby przejść do strony edycji bilansu!">Edytuj</a>  
    </div>
   </div>
   <div class="row mt-3">
     <div class="col-6 offset-3">
      <button class="btn btn-outline-danger w-100" style="margin: auto;" title="Naciskając, usuwasz obecny balans i dodajesz nowy" @click="newOne = true">Nowy</button>
    </div>
   </div>
   <div class="modal" ref="newBalanceModal" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Czy na pewno chcesz usunąć obecny bilans i dodać nowy?</h4>
            <button type="button" class="close" data-dismiss="modal" @click="newOne = false">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="newOne = false">Nie</button>
            <button @click="createNew" class="btn btn-outline-danger" data-dismiss="modal">Tak</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'landing-page',
    created () {
      if (this.$store.state.Balance.assets.length + this.$store.state.Balance.liabilities.length === 0) {
        this.$store.commit('INIT_A_L')
        this.$store.commit('SET_CATEGORIES')
        this.$store.dispatch('loadData')
      }
    },
    methods: {
      open (asset) {
        this.$store.commit('OPEN', asset)
      },
      createNew () {
        this.$store.commit('NEW_BALANCE')
      },
      getSum (subtable) {
        var sum = 0
        subtable.forEach(data => {
          sum += data.money
        })
        return sum
      },
      getSumGroup (group) {
        var sum = 0
        group.subCategories.forEach(cat => {
          sum += this.getSum(cat.subtable)
        })
        return sum
      }
      // edit (input) {
      //   this.editDesc = input.desc
      //   this.editName = input.name
      //   this.editMoney = input.money
      // },
      // startEditing (cur, subIndex, groupIndex) {
      //   this.currentlyEditing = cur
      //   this.groupIndex = groupIndex
      //   this.subIndex = subIndex
      //   this.editing = true
      // },
      // editAsset () {
      //   let input = this.currentlyEditing
      //   let indexInSub = this.subIndex
      //   let indexInGroup = this.groupIndex
      //   this.edit(input)
      //   var oldCategory = {name: this.$store.state.Balance.assets[indexInGroup].subCategories[indexInSub].name, indexInSub, indexInGroup}
      //   var newInp = {name: this.editName, money: this.editMoney, desc: this.editDesc, category: this.editCategory}
      //   this.editCategory = oldCategory
      //   event.sender.send('editOne', {old: input, oldCategory, newInp})
      //   this.editing = false
      //   this.$store.commit('EDIT_ASSET', {old: input, oldCategory, newInp})
      // },
      // editLiab () {
      //   let input = this.currentlyEditing
      //   let indexInSub = this.subIndex
      //   let indexInGroup = this.groupIndex
      //   this.edit(input)
      //   var oldCategory = {name: this.$store.state.Balance.liabilities[indexInGroup].subCategories[indexInSub].name, indexInSub, indexInGroup}
      //   var newInp = {name: this.editName, money: this.editMoney, desc: this.editDesc, category: this.editCategory}
      //   this.editCategory = oldCategory
      //   event.sender.send('editOne', {old: input, oldCategory, newInp})
      //   this.editing = false
      //   this.$store.commit('EDIT_LIAB', {old: input, oldCategory, newInp})
      // }
    },
    data: () => {
      return {
        // assets: [],
        // liabilities: [],
        // // editCategory: {name: ''},
        // // editName: '',
        // // editMoney: 0,
        // // editDesc: '',
        // // editing: false,
        // // currentlyEditing: {},
        // subIndex: 0,
        // groupIndex: 0,
        newOne: false
      }
    },
    computed: {
      assetsSum: {
        get () {
          var sum = 0
          this.$store.state.Balance.assets.forEach(liab => {
            liab.subCategories.forEach(subAsset => {
              subAsset.subtable.forEach(record => {
                sum += record.money
              })
            })
          })
          return sum
        }
      },
      liabsSum: {
        get () {
          var sum = 0
          this.$store.state.Balance.liabilities.forEach(liab => {
            liab.subCategories.forEach(subLiab => {
              subLiab.subtable.forEach(record => {
                sum += record.money
              })
            })
          })
          return sum
        }
      }
    },
    watch: {
      newOne (value) {
        if (value) {
          $(this.$refs.newBalanceModal).modal('show')
        } else {
          $(this.$refs.newBalanceModal).modal('hide')
        }
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  @import "~bootstrap/dist/css/bootstrap.css";
  body { font-family: 'Source Sans Pro', sans-serif; }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  .buttonHolder{
  margin:80px auto;
  width:400px;
}
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
  .buttonMore {
    background-image: -webkit-linear-gradient(top, #f4f1ee, #fff);
    background-image: linear-gradient(top, #f4f1ee, #fff);
    border-radius: 50%;
    box-shadow: 0px 8px 10px 0px rgba(0, 0, 0, .3), inset 0px 4px 1px 1px white, inset 0px -3px 1px 1px rgba(204,198,197,.5);
    float:left;
    height: 45px;
    margin: 0 30px 30px 0;
    position: relative;
    width: 45px;      
    -webkit-transition: all .1s linear;
    transition: all .1s linear;
  }
  .moveUp {
    position: relative;
    top: -35px;
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
  .buttonMore:after{
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

  .flower:after{
    content: "✿";
    left: 23px;
    top: 14px;
  }
  .expand:after {
    content: url(~@/assets/more.png);
    left: 6.5px;
    top: 7px;
  }
  .expandable:after {
    content: url(~@/assets/more.png);
    left: 6.5px;
    top: 7px;
  }
  .tick:after{
    content: "✔";
    left: 10px;
    top: 5.5px;
  }

  .cross:after{
    content: "✖";
    left: 24px;
    top: 15px;
  }

  .button:hover{
    background-image: -webkit-linear-gradient(top, #fff, #f4f1ee);
    background-image: linear-gradient(top, #fff, #f4f1ee);
    color:#0088cc;
  }

  .trash:hover:after{
    content: url(~@/assets/trash-can.png);
    color:#ff0134;
    text-shadow:0px 0px 6px #f94e66;
  }

  .flower:hover:after{
    color:#f99e4e;
    text-shadow:0px 0px 6px #f99e4e;
  }

  .tick:hover:after{
    color:#83d244;
    text-shadow:0px 0px 6px #83d244;
  }

  .expand:hover:after {
    content: url(~@/assets/more-color.png);
    text-shadow:0px 0px 6px #83d244;
  }
  .expandable:hover:after {
    content: url(~@/assets/more-red.png);
    text-shadow:0px 0px 6px #83d244; 
  }

  .cross:hover:after{
    color:#eb2f2f;
    text-shadow:0px 0px 6px #eb2f2f;
  }

  .button:active{
    background-image: -webkit-linear-gradient(top, #efedec, #f7f4f4);
    background-image: linear-gradient(top, #efedec, #f7f4f4);
    box-shadow: 0 3px 5px 0 rgba(0,0,0,.4), inset 0px -3px 1px 1px rgba(204,198,197,.5);
  }

  .button:active:after{
    color:#dbd2d2;
    text-shadow: 0px -1px 1px #bdb5b4, 0px 1px 1px white;
  }
</style>
