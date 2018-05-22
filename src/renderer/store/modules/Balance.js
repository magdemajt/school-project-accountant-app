const state = {
  assets: [],
  assetCategories: [],
  liabilities: [],
  liabCategories: []
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
    state.assets.forEach((asset) => {
      asset.subCategories.forEach((subAsset) => {
        state.assetCategories.push(subAsset.name)
      })
    })
    state.liabilities.forEach((liab) => {
      liab.subCategories.forEach((subLiab) => {
        state.liabCategories.push(subLiab.name)
      })
    })
  },
  OPEN (state, asset) {
    asset.opened = !asset.opened
  }
}

export default {
  state,
  mutations
}
