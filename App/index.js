import React from 'react';
import {
  StyleSheet, View, Text, StatusBar,
  TouchableOpacity, Dimensions, Picker, Platform
} from 'react-native';


const screen = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timerText: {
    color: '#fff',
    fontSize: 60,
  },
  button: {
    borderWidth: 10,
    borderColor: '#89AAFF',
    borderRadius: screen.width / 2,
    width: screen.width / 2,
    height: screen.width / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 45,
    color: '#89AAFF'
  },
  buttonStop: {
    borderColor: '#FF851B',
  },
  buttonTextStop: {
    color: '#FF851B'
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10
      }
    })
  },
  pickerItem: {
    color: '#fff',
    fontSize: 20,
  }
});

const formatNumber = (number) => `0${number}`.slice(-2)

const getRemaining = (time) => {
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return {
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds)
  };
}

const createArray = (length) => {
  const arr = [];
  let i = 0;

  while (i < length) {
    arr.push(i.toString());
    i++;
  }

  return arr;
}

const AVAILABLE_HOURS = createArray(24);
const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

class App extends React.Component {
  state = {
    remainingSeconds: 1,
    isRunning: false,
    selectedHours: '0',
    selectedMinutes: '0',
    selectedSeconds: '0',
  }

  componentDidMount(prevProp, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stop();
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  start = () => {
    this.setState({
      remainingSeconds: parseInt(this.state.selectedHours, 10) * 60 * 60 + parseInt(this.state.selectedMinutes, 10) * 60 + parseInt(this.state.selectedSeconds, 10),
      isRunning: true,
    });

    this.interval = setInterval(() => {
      this.setState({
        remainingSeconds: this.state.remainingSeconds - 1,
      });
    }, 1000);
  }

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({ remainingSeconds: 5, isRunning: false });
  }

  renderPickers = () => {
    return (
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedHours}
          onValueChange={itemValue => {
            this.setState({
              selectedHours: itemValue,
            })
          }}
          mode='dropdown'
        >
          {AVAILABLE_HOURS.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>hours</Text>


        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedMinutes}
          onValueChange={itemValue => {
            this.setState({
              selectedMinutes: itemValue,
            })
          }}
          mode="dropdown"
        >
          {AVAILABLE_MINUTES.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>

        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={this.state.selectedSeconds}
          onValueChange={itemValue => {
            this.setState({
              selectedSeconds: itemValue,
            })
          }}
          mode='dropdown'
        >
          {AVAILABLE_SECONDS.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
    );
  }

  render() {
    const { hours, minutes, seconds } = getRemaining(this.state.remainingSeconds);
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        {
          this.state.isRunning ?
            (<Text style={styles.timerText}>{`${hours}:${minutes}:${seconds}`}</Text>) :
            (this.renderPickers())
        }
        {
          this.state.isRunning ?
            (
              <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
                <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity onPress={this.start} style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            )
        }
      </View>
    );
  };
};

export default App;
