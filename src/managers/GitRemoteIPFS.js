import '../typedefs.js'

import { UserCanceledError } from '../errors/UserCanceledError.js'
import { collect } from '../utils/collect.js'
import { parseRefsAdResponse } from '../wire/parseRefsAdResponse.js'

// // https://stackoverflow.com/questions/30558769/how-can-i-fetch-git-objects-using-the-smart-protocol-raw-over-http
// This is awesome and uses curl lines

// https://github.com/git/git/blob/master/Documentation/technical/pack-protocol.txt


// All HTTP clients MUST begin either a fetch or a push exchange by discovering the references available on the remote repository.

// push to ipfs
function discoverRefsGitReceivePack() {

  // Here's the response for: 
  // curl --user "snickell" -H "User-Agent: git/1.8.1" -v  "https://github.com/snickell/python-mapnik/info/refs?service=git-receive-pack" --output receive-pack

  /*
  001f# service=git-receive-pack
  000000a529e786209eb83520a6eb07f8c9d1bb3724579cd0 refs/heads/develop-master report-status delete-refs side-band-64k quiet atomic ofs-delta agent=git/github-g8735eb3c5505
  004a1a4337f1deaec17f36e881aa203678c965711fbc refs/heads/geometry-refactor
  00476a5efb731e5e5be0f0245e51d6580d142003bc52 refs/heads/makefile-tests
  004553c58e54eda3d8d7d81b253cc8ddd91afd84420f refs/heads/mason-client
  003f25499e34395ca614d74c1fc684753d8b95077f10 refs/heads/master
  00404a18669b33431344bc9f9779f8e4c2c8ee66cef5 refs/heads/patch-1
  004127e204786b93d6a7a199da26ff32b4ac875b93f5 refs/heads/pickling
  003f7da019cf9eb12af8f8aa88b7d75789dfcd1e901b refs/heads/v3.0.x
  003fb5b579949b79d977c974a58588b9f82dc06af6b4 refs/tags/v3.0.13
  003f33268d27ce260e161ee05c1852e942f5f0c213d8 refs/tags/v3.0.16
  0033a2c2a86eec954b42d7f00093da03807d0834b1b4 .have
  0000
  */
}

// push to ipfs
function gitReceivePack() {

}


// fetch from ipfs
function discoverRefsGitUploadPack() {
  // for example, try:
  //
  // curl -H "User-Agent: git/1.8.1" -v  "https://github.com/git/git/info/refs?service=git-upload-pack" --output -

  /*
  001e# service=git-upload-pack
  0000014325499e34395ca614d74c1fc684753d8b95077f10 HEAD multi_ack thin-pack side-band side-band-64k ofs-delta shallow deepen-since deepen-not deepen-relative no-progress include-tag multi_ack_detailed allow-tip-sha1-in-want allow-reachable-sha1-in-want no-done symref=HEAD:refs/heads/master filter agent=git/github-g8735eb3c5505
  004729e786209eb83520a6eb07f8c9d1bb3724579cd0 refs/heads/develop-master
  004a1a4337f1deaec17f36e881aa203678c965711fbc refs/heads/geometry-refactor
  00476a5efb731e5e5be0f0245e51d6580d142003bc52 refs/heads/makefile-tests
  004553c58e54eda3d8d7d81b253cc8ddd91afd84420f refs/heads/mason-client
  003f25499e34395ca614d74c1fc684753d8b95077f10 refs/heads/master
  00404a18669b33431344bc9f9779f8e4c2c8ee66cef5 refs/heads/patch-1
  004127e204786b93d6a7a199da26ff32b4ac875b93f5 refs/heads/pickling
  003f7da019cf9eb12af8f8aa88b7d75789dfcd1e901b refs/heads/v3.0.x
  003fb5b579949b79d977c974a58588b9f82dc06af6b4 refs/tags/v3.0.13
  0042d7fc489aca0cc0aaced8c5bf49abc58eb14f903e refs/tags/v3.0.13^{}
  003f33268d27ce260e161ee05c1852e942f5f0c213d8 refs/tags/v3.0.16
  00420cd7493f213bab9eb338ec68a2b013402d4dc9e3 refs/tags/v3.0.16^{}
  0000
  */


  // C: GET $GIT_URL/info/refs?service=git-upload-pack HTTP/1.0

  // smart server reply:

  // S: 200 OK
  // S: Content-Type: application/x-git-upload-pack-advertisement
  // S: Cache-Control: no-cache
  // S:
  // S: 001e# service=git-upload-pack\n
  // S: 0000
  // S: 004895dcfa3633004da0049d3d0fa03f80589cbcaf31 refs/heads/maint\0multi_ack\n
  // S: 003fd049f6c27a2244e12041955e262a404c7faba355 refs/heads/master\n
  // S: 003c2cb58b79488a98d2721cea644875a8dd0026b115 refs/tags/v1.0\n
  // S: 003fa3c2e2402b99163d1d59756e5f207ae21cccba4c refs/tags/v1.0^{}\n
  // S: 0000
}

// fetch from ipfs
function gitUploadPack({
  capabilities,
  wants,
  haves,
  shallows,
  depth,
  since,
  exclude,
}) {
  // This service reads from the repository pointed to by $GIT_URL.

  // Clients MUST first perform ref discovery with $GIT_URL/info/refs?service=git-upload-pack.
  
  // C: POST $GIT_URL/git-upload-pack HTTP/1.0
  // C: Content-Type: application/x-git-upload-pack-request
  // C:
  // C: 0032want 0a53e9ddeaddad63ad106860237bbf53411d11a7\n
  // C: 0032have 441b40d833fdfa93eb2908e52742248faf0ee993\n
  // C: 0000
  // S: 200 OK
  // S: Content-Type: application/x-git-upload-pack-result
  // S: Cache-Control: no-cache
  // S:
  // S: ....ACK %s, continue
  // S: ....NAK

  return {
    shallows, // list of oids
    unshallows, // list of oids
    acks, // ignored by fetch
    nak, // ignored by fetch
    packfile, // written to disk by fetch
    progress
  }
}


export class GitRemoteIPFS {
  static async capabilities() {
    return ['discover', 'connect']
  }

  static async discover({service, url, protocolVersion}) {
    // Pseudocode for GitRemoteHTTP.discover:
    // 
    // body = GET(`${url}/info/refs?service=${service}`)
    // import { parseRefsAdResponse } from '../wire/parseRefsAdResponse.js'
    // return parseRefsAdResponse(body)

    const capabilities = new Set()
    const refs = new Map() // { ref : oid }
    const symrefs = new Map()

    return { protocolVersion: 1, capabilities, refs, symrefs }
  }

  static async connect({service, url}) {
    // POST: `${url}/${service}`
  }
}
