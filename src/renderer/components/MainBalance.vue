<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
     <div class="full-bar">
      <a href="#/change">Zmiana</a>
       <table>
       <ul>
         <li v-for="asset in $store.state.Balance.assets">
           <h3>{{ asset.name }}</h3><button @click="open(asset)"> Otwórz </button>
           <ul>
             <li v-if="asset.opened" v-for="subAsset in asset.subCategories">
               <h5>{{subAsset.name}}</h5><button @click="open(subAsset)"> Otwórz </button>
               <ul>
                 <li v-if="subAsset.opened" v-for="records in subAsset.subtable"></li>
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
      }
    },
    methods: {
      open (asset) {
        this.$store.commit('OPEN', asset)
      }
    },
    data: () => {
      return {
        assets: [],
        liabilities: []
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
