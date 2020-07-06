import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import PickerSelect from 'react-native-picker-select';
import axios from 'axios'

interface IBGEUF {
  name: string
  initial: string
}

interface IBGECity {
  id: number
  name: string
}

const Home = () => {
  const [ufs, setUfs] = useState<IBGEUF[]>([])
  const [cities, setCities] = useState<IBGECity>([])
  const [selectedUf, setSelectedUf] = useState<String>('')
  const [selectedCity, setSelectedCity] = useState<String>('Hello From ReactNative')

  const navigation = useNavigation()

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    })
  }

  function handleSelectedUf(uf) {
    setSelectedUf(uf)
  }

  function handleSelectedCity(city) {
    setSelectedCity(city)
  }

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufs = response.data.map(uf => {
          return {
            initial: uf.sigla,
            name: uf.nome
          }
        })

      setUfs(ufs) 
    })
  }, [])

  useEffect(() => {
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cities = response.data.map(({ id, nome }) => {
          return {
            id,
            name: nome
          }
        })

      setCities(cities)
    })
  }, [selectedUf])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos  de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <PickerSelect
            useNativeAndroidPickerStyle={false}
            style={pickerSelect}
            onValueChange={uf => handleSelectedUf(uf)}
            value={selectedUf}
            placeholder={{
              label: 'Escolha um estado'
            }}
            items={ufs.map(({name, initial}) => {
              return {
                label: name,
                value: initial,
                key: initial
              }
            })}
          />

          <PickerSelect
            useNativeAndroidPickerStyle={false}
            style={pickerSelect}
            onValueChange={uf => handleSelectedCity(uf)}
            value={selectedCity}
            placeholder={{
              label: 'Escolha uma cidade'
            }}
            items={cities.map(({ id, name }) => {
              return {
                label: name,
                value: name,
                key: id
              }
            })}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const pickerSelect = {
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
})

export default Home
