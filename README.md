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

3. Install Multichain
```bash
$ wget https://www.multichain.com/download/multichain-1.0.1.tar.gz
$ tar -xvzf multichain-1.0.1.tar.gz
$ cd multichain-1.0.1
$ mv multichaind multichain-cli multichain-util /usr/local/bin
```

4. Run 4 separate nodes

Create 4 folders named FDANode, PharmNode, DistNode, ManfNode
Then, 
```bash

cd /

multichaind blockchain -datadir=/root/MultiChainDir/FDANode -port=6451 -rpcport=6450 -daemon
multichaind blockchain -datadir=/root/MultiChainDir/PharmNode/ -port=7000 -rpcport=6999 -daemon
multichaind blockchain -datadir=/root/MultiChainDir/DistNode/ -port=8000 -rpcport=7999 -daemon
multichaind blockchain -datadir=/root/MultiChainDir/ManfNode/ -port=9000 -rpcport=8999 -daemon

```


Create 4 streams: pubkeys, data, access, recall
Using each account, post respective public key to the pubkeys stream.


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

## Contributors

- [Amol Pednekar](https://github.com/amolpednekar)
- [Shubham Verekar](https://github.com/shubhamvrkr)
