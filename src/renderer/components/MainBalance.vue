<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
     <div v-if="editing">
       {{ editCategory.name }}
       <input type="text" v-model="editName">
       <input type="text" v-model="editDesc">
       <input type="number" v-model="editMoney">
       <!-- <button @click="editAsset(record, subIndex, index)">Edytuj</button> -->
     </div>
     <div class="full-bar">
      <a href="#/change">Zmiana</a>
       <table>
       <ul>
         <li v-for="(asset, index) in $store.state.Balance.assets">
           <h3>{{ asset.name }}</h3><button @click="open(asset)"> Otwórz </button>
           <ul>
             <li v-if="asset.opened" v-for="(subAsset, subIndex) in asset.subCategories">
               <h5>{{subAsset.name}}</h5><button @click="open(subAsset)"> Otwórz </button>
               <ul>
                 <li v-if="subAsset.opened" v-for="(record) in subAsset.subtable">
                   {{ record.name }} Kwota: {{ record.money }} 
                   Opis: {{ record.desc }}
                   <!-- <button @click="startEditing(record, subIndex, index)">Edytuj</button> -->
                 </li>
               </ul>
             </li>
           </ul>
         </li>
       </ul>
     </table>
     </div>
    </main>
  </div>
</template>

<script>
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
        assets: [],
        liabilities: [],
        editCategory: {name: ''},
        editName: '',
        editMoney: 0,
        editDesc: '',
        editing: false,
        currentlyEditing: {},
        subIndex: 0,
        groupIndex: 0
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
  .full-bar {
    width: 100%;
  }
</style>
