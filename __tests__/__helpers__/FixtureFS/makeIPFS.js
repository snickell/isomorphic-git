const fs = require('fs')
const path = require('path')

const { FileSystem } = require('isomorphic-git/internal-apis')

const BASE_MFS_PATH = '/isomorphic-git-tests/'

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory()) yield* walk(entry)
    else if (d.isFile()) yield entry
  }
}

const randomString = length =>
  Array(length)
    .fill(0)
    .map(x =>
      Math.random()
        .toString(36)
        .charAt(2)
    )
    .join('')

const tempPath = () => path.join(BASE_MFS_PATH, randomString(8))

async function createIpfsTempDir(ipfs) {
  const dir = tempPath()
  await ipfs.files.mkdir(dir, { parents: true })
  return dir
}

async function copyFixtureIntoIpfsTempDir(ipfs, basedir, fixture) {
  const dir = await createIpfsTempDir()
  const srcDir = path.join(basedir, fixture)
  for await (const srcPath of walk(srcDir)) {
    const destPath = path.join(dir, srcPath)
    const srcStream = fs.createReadStream(srcPath)
    ipfs.files.write(destPath, srcStream, {
      flush: false,
      parents: true,
    })
  }
}

async function makeIPFS(fixture) {
  const { getFixturePath } = require('jest-fixtures')

  const FS = require('isomorphic-git-ipfs')
  const _fs = new FS()
  const fs = new FileSystem(_fs)
  const ipfs = await _fs.ipfs

  const testsDir = path.resolve(__dirname, '..')

  const dir = (await getFixturePath(testsDir, fixture))
    ? await copyFixtureIntoIpfsTempDir(ipfs, testsDir, fixture)
    : await createIpfsTempDir(ipfs)

  const gitdir = (await getFixturePath(testsDir, `${fixture}.git`))
    ? await copyFixtureIntoIpfsTempDir(ipfs, testsDir, `${fixture}.git`)
    : await createIpfsTempDir(ipfs)

  return { _fs, fs, dir, gitdir }
}

module.exports.makeIPFS = makeIPFS
