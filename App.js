import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    }
  },
});

export default function App() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function permissoesIos(){
      return await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
        },
      });
    };

    permissoesIos();

    /* Ouvinte de evento para notificações recebidas, ou seja,
    quando a notificação aparece no topo do app */
    Notifications.addNotificationReceivedListener(notificacao => {
      console.log(notificacao);
    });

    /* Ouvinte de evento para as respostas dadas às notificações,
    ou seja, quando o usuário interage (toca) notificação. */
    Notifications.addNotificationResponseReceivedListener((resposta) => {
      setDados(resposta.notification.request.content.data);
    });

  },[]);

  const enviarMensagem = async () => {
    /* Montando a mensagem que será enviada
    via sistema de notificação LOCAL */
    const mensagem = {
      title: "Lembrete! 🎈",
      body: "Estuda Muleke. ó PITBUL ENRAIVADO",
      data: {
        usuario: "Roronoa Zoro",
        cidade: "Uberlândia"
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: mensagem,
      // Acionador/disparador da notificação
      trigger: { seconds: 5 },
    })
  };
  return (
    <>
    <StatusBar />
    <View style={styles.container}>
      <Text>Exemplo de notificação local</Text>
      <Button title='Disparar notificação' onPress={enviarMensagem}/>

      {dados && (
        <View style={{marginVertical: 8, backgroundColor: "yellow", padding: 5}}>
          <Text>Usuario: {dados.usuario}</Text>
          <Text>Cidade: {dados.cidade}</Text>
        </View>
        )}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
