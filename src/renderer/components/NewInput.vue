<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div v-if="addingAsset || addingLiab">
        <input type="text" v-model="addingName" placeholder="Nazwa...">
        <input type="text" v-model="addingDescription" placeholder="Opis...">
        <input type="text" v-model="addingCategory" placeholder="Kategoria...">
        <input type="number" v-model="addingMoney" placeholder="Kwota...">
        <button type="button" @click="addButtonListener">Akceptuj</button>
      </div>
      <div class="left-side">
        <button @click="addingAsset = true">Dodaj nowe aktywa</button>
        <ul>
          <li v-for="asset in assets">
            Nazwa: {{ asset.name }} Kategoria: {{ asset.category }} Kwota: {{ asset.money }}
          </li>
        </ul>
      </div>
      <div class="right-side">
        <button @click="addingLiab = true">Dodaj nowe pasywa</button>
        <ul>
          <li v-for="liab in liabilities">
            Nazwa: {{ liab.name }} Kategoria: {{ liab.category }} Kwota: {{ liab.money }}
          </li>
        </ul>
      </div>
      <div class="full-bar">
        <button @click="save">Zapisz</button>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
    methods: {
      save () {
        var assetNum = 0
        this.assets.forEach((asset, index) => {
          assetNum += asset.money
        })
        var liabNum = 0
        this.liabilities.forEach((liab) => {
          liabNum += liab.money
        })
        if (assetNum === liabNum) {
          // ....
          var index = 1 // this.$store.state.lastSavedNumber <-- Nazwy plików jako numery kolejnych
          this.$electron.ipcRenderer.send('addRecord', [this.assets, this.liabNum, index])
          this.$electron.ipcRenderer.on('reply', () => {
            console.log('Reply')
          })
        }
      },
      add (group) {
        this.addingAsset = false
        this.addingLiab = false
        this.addingMoney = Number(this.addingMoney)
        group.push({money: this.addingMoney, name: this.addingName, category: this.addingCategory, desc: this.addingDescription})
        this.addingName = this.addingCategory = this.addingDescription = 'Test'
        this.addingMoney = 50
      },
      addButtonListener () {
        if (this.addingAsset) {
          this.add(this.assets)
        } else if (this.addingLiab) {
          this.add(this.liabilities)
        }
      }
    },
    data: () => {
      return {
        assets: [],
        liabilities: [],
        addingAsset: false,
        addingLiab: false,
        addingMoney: 0,
        addingCategory: 'Test',
        addingName: 'Test',
        addingDescription: 'Test'
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
