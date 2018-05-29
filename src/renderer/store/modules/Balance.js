import { ipcRenderer } from 'electron'
var BalanceElement = class {
  constructor (name, subtable) {
    this.name = name
    this.subCategories = subtable
    this.opened = false
  }
}
var BalanceInnerElement = class {
  constructor (name) {
    this.name = name
    this.subtable = []
    this.opened = false
  }
}
const state = {
  assets: [],
  assetCategories: [],
  liabilities: [],
  liabCategories: [],
  lastSavedNumber: 0,
  unfinished: [],
  lastUnfinishedNumber: 0,
  editing: '',
  balances: [],
  currentBalance: {balanceId: 0}
}

const mutations = {
  INIT_A_L (state) {
    var tableFirst = [new BalanceInnerElement('Wartości niematerialne i prawne'), new BalanceInnerElement('Rzeczowe aktywa trwałe'), new BalanceInnerElement('Należności długoterminowe'), new BalanceInnerElement('Inwestycje długoterminowe'), new BalanceInnerElement('Długoterminowe rozliczenia międzyokresowe')]
    state.assets.push(new BalanceElement('Aktywa trwałe', tableFirst))
    // Obrotowe
    var tableSecond = [new BalanceInnerElement('Zapasy'), new BalanceInnerElement('Należności krótkoterminowe'), new BalanceInnerElement('Inwestycje krótkoterminowe'), new BalanceInnerElement('Krótkoterminowe rozliczenia międzyokresowe')]
    state.assets.push(new BalanceElement('Aktywa obrotowe', tableSecond))
    // Pasywa
    var tableThird = [new BalanceInnerElement('Kapitał podstawowy'), new BalanceInnerElement('Kapitał zapasowy')]
    state.liabilities.push(new BalanceElement('Kapitał własny', tableThird))

    var tableFourth = [new BalanceInnerElement('Rezerwy na zobowiązania'), new BalanceInnerElement('Zobowiązania długoterminowe'), new BalanceInnerElement('Inwestycje krótkoterminowe'), new BalanceInnerElement('Zobowiązania krótkoterminowe'), new BalanceInnerElement('Rozliczenia międzyokresowe')]
    state.liabilities.push(new BalanceElement('Zobowiązania i rezerwy na zobowiązania', tableFourth))
  },
  SET_CATEGORIES (state) {
    state.assets.forEach((asset, assetIndex) => {
      asset.subCategories.forEach((subAsset, index) => {
        state.assetCategories.push({name: subAsset.name, indexInSub: index, indexInGroup: assetIndex})
      })
    })
    state.liabilities.forEach((liab, liabIndex) => {
      liab.subCategories.forEach((subLiab, index) => {
        state.liabCategories.push({name: subLiab.name, indexInGroup: liabIndex, indexInSub: index})
      })
    })
  },
  OPEN (state, asset) {
    asset.opened = !asset.opened
  },
  ADD_INTERNAL (state, payload) {
    payload.where.push(payload.toAdd)
  },
  CHANGE_LAST_SAVED (state, newLastSaved) {
    state.lastSavedNumber = newLastSaved
  },
  CHANGE_UNFINISHED (state, newUnfinished) {
    state.lastUnfinishedNumber = newUnfinished
  },
  NEW_BALANCE (state) {
    // var balanceId = 0
    // for (var x = 0; x < state.balance.length; x++) {
    //   var balance = state.balances[x]
    //   if (balance.balanceId - 1 !== balanceId) {
    //     balanceId = balance.balanceId - 1
    //     break
    //   }
    //   balanceId = balance.balanceId
    // }

    ipcRenderer.send('newBalance')
    state.assets.forEach((asset, assetIndex) => {
      asset.subCategories.forEach((subAsset, index) => {
        subAsset.subtable = []
      })
    })
    state.liabilities.forEach((liab, liabIndex) => {
      liab.subCategories.forEach((subLiab, index) => {
        subLiab.subtable = []
      })
    })
  },
  EDIT_ONE_UNFINISHED (state, payload) {
    state.editing = payload.value
  },
  REMOVE_UNFINISHED (state, payload) {
    state.unfinished.splice(state.unfinished.indexOf(payload), 1)
  },
  ADD_CATEGORY_NAME_TO_UNFINISHED (state) {
    state.unfinished.forEach((unf) => {
      unf.assets.forEach((asset) => {
        var category = {name: state.assets[asset.category.indexInGroup].subCategories[asset.category.indexInSub].name, indexInSub: asset.category.indexInSub, indexInGroup: asset.category.indexInGroup}
        asset.category = category
      })
      unf.liabs.forEach((liab) => {
        var category = {name: state.liabilities[liab.category.indexInGroup].subCategories[liab.category.indexInSub].name, indexInSub: liab.category.indexInSub, indexInGroup: liab.category.indexInGroup}
        liab.category = category
      })
    })
  }
}

const actions = {
  loadData (context) {
    ipcRenderer.send('getData') // If second argument is true then send assets unless send liabs , {balanceId: context.state.currentBalance.balanceId}
    ipcRenderer.on('sendingData', (event, args) => {
      args.assets.forEach(asset => {
        context.commit('ADD_INTERNAL', {where: context.state.assets[asset.category.indexInGroup].subCategories[asset.category.indexInSub].subtable, toAdd: {name: asset.name, money: asset.money, desc: asset.desc, file: args.index}})
      })
      args.liabs.forEach(liab => {
        context.commit('ADD_INTERNAL', {where: context.state.liabilities[liab.category.indexInGroup].subCategories[liab.category.indexInSub].subtable, toAdd: {name: liab.name, money: liab.money, desc: liab.desc, file: args.index}})
      })
      context.commit('CHANGE_LAST_SAVED', args.index)
    })
  },
  getUnfinished (context) {
    ipcRenderer.send('getUnfinished') // , {balanceId: context.state.currentBalance.balanceId}
    ipcRenderer.on('sendingUnfinished', (event, args) => {
      context.commit('ADD_INTERNAL', {where: context.state.unfinished, toAdd: args})
      context.commit('ADD_CATEGORY_NAME_TO_UNFINISHED')
    })
  }
  // getBalances (context) {
  //   ipcRenderer.send('getBalances')
  //   ipcRenderer.on('balances', args => {
  //     args.forEach((balance) => {
  //       context.commit('ADD_INTERNAL', {where: context.state.balances, toAdd: {balanceId: balance}})
  //     })
  //   })
  // }
}

export default {
  state,
  mutations,
  actions
}
