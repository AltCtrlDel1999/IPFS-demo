const ipfsClient = require('ipfs-http-client');
const CID = require('cids');
const ipfs = new ipfsClient({host: 'ipfs.infura.io', port:'5001', protocol:'https'});

const errOrLog = (err, result) => {
    if (err) {
      console.error('error: ' + err)
    } else {
      console.log(result)
    }
}


const createIpld = async () =>{
  const far = await ipfs.dag.get('QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN');
  const sampleObject = {
    f: {
      link: far,
    },
  };

  let file = await ipfs.dag.put(sampleObject,{ format: 'dag-cbor', hashAlg: 'sha2-256' });

  let secondNode = await ipfs.dag.put({
          e:{
              link: file,
          },
    },{ format: 'dag-cbor', hashAlg: 'sha2-256' });

  //  const multihash = secondNode.multihash;

    //passing multihash buffer to CID object to convert multihash to a readable format
    //const cids = new CID(1, 'dag-cbor', multihash);

    //console.log(cids.toBaseEncodedString());
    console.log(secondNode.toString());
    //Featching the value using links
    const result = await ipfs.dag.get(secondNode.toString()+'/e/link/f/link');
    console.log(result.value.value);
    /* prints { value: 'vasa', remainderPath: '' } */
}
createIpld();
