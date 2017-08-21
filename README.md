# Supply-Chain-POC : Multichain

Pharmaceutical Drugs-Supply-Chain POC built on MultiChain

## Using this project

1. Install NodeJS 

```bash
$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

2. Install Ionic

```bash
$ npm install -g ionic
```

Start the network
```bash

cd /

multichaind blockchain -datadir=/root/MultiChainDir/FDANode -port=6451 -rpcport=6450 -daemon
multichaind blockchain -datadir=/root/MultiChainDir/PharmNode/ -port=7000 -rpcport=6999 -daemon
multichaind blockchain -datadir=/root/MultiChainDir/DistNode/ -port=8000 -rpcport=7999 -daemon
multichaind blockchain -datadir=/root/MultiChainDir/ManfNode/ -port=9000 -rpcport=8999 -daemon

```

In the folder 'SupplyChainServer' run: 

```bash
$ npm install
```

Install all required plugins, in 'Frontend' folder, run

```bash
$ ionic state reset (First time only)
```

## Run the project

To start backend server (to use Multichain API), in the folder 'SupplyChainServer' run: 

```bash
$ node server.js 
```

To start frontend server, in 'Frontend' folder, run

```bash
$ ionic serve
```
