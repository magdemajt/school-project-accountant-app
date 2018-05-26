import { ipcRenderer } from 'electron'
const state = {
  assets: [],
  assetCategories: [],
  liabilities: [],
  liabCategories: [],
  lastSavedNumber: 0,
  unfinished: [],
  lastUnfinishedNumber: 0,
  editing: ''
}

const mutations = {
  INIT_A_L (state) {
    state.assets.push({
      name: 'Aktywa trwałe',
      opened: false,
      subCategories: [
        {
          name: 'Wartości niematerialne i prawne',
          opened: false,
          subtable: []
        },
        {
          name: 'Rzeczowe aktywa trwałe',
          opened: false,
          subtable: []
        },
        {
          name: 'Należności długoterminowe',
          opened: false,
          subtable: []
        },
        {
          name: 'Inwestycje długoterminowe',
          opened: false,
          subtable: []
        },
        {
          name: 'Długoterminowe rozliczenia międzyokresowe',
          opened: false,
          subtable: []
        }
      ]
    })
    // Obrotowe
    state.assets.push({
      name: 'Aktywa obrotowe',
      opened: false,
      subCategories: [
        {
          name: 'Zapasy',
          opened: false,
          subtable: []
        },
        {
          name: 'Należności krótkoterminowe',
          opened: false,
          subtable: []
        },
        {
          name: 'Inwestycje którkoterminowe',
          opened: false,
          subtable: []
        },
        {
          name: 'Krótkoterminowe rozliczenia międzyokresowe',
          opened: false,
          subtable: []
        }
      ]
    })
    // Pasywa
    state.liabilities.push({
      name: 'Kapitał własny',
      opened: false,
      subCategories: [
        {
          name: 'Kapitał podstawowy',
          opened: false,
          subtable: []
        },
        {
          name: 'Kapitał zapasowy',
          opened: false,
          subtable: []
        }
      ]
    })
    state.liabilities.push({
      name: 'Zobowiązania i rezerwy na zobowiązania',
      opened: false,
      subCategories: [
        {
          name: 'Rezerwy na zobowiązania',
          opened: false,
          subtable: []
        },
        {
          name: 'Zobowiązania długoterminowe',
          opened: false,
          subtable: []
        },
        {
          name: 'Inwestycje krótkoterminowe',
          opened: false,
          subtable: []
        },
        {
          name: 'Zobowiązania krótkoterminowe',
          opened: false,
          subtable: []
        },
        {
          name: 'Rozliczenia międzyokresowe',
          opened: false,
          subtable: []
        }
      ]
    })
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
  }
}

const actions = {
  loadData (context) {
    ipcRenderer.send('getData', true) // If second argument is true then send assets unless send liabs
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
    ipcRenderer.send('getUnfinished')
    ipcRenderer.on('sendingUnfinished', (event, args) => {
      context.commit('ADD_INTERNAL', {where: context.state.unfinished, toAdd: args})
    })
  }
}

export default {
  state,
  mutations,
  actions
}
