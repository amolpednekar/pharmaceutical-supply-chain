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
