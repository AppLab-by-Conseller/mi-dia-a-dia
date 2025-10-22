const animals = [
  'alligator', 'anteater', 'armadillo', 'auroch', 'axolotl', 'badger', 'bat', 'beaver', 'buffalo', 'camel',
  'capybara', 'chameleon', 'cheetah', 'chinchilla', 'chipmunk', 'chupacabra', 'cormorant', 'coyote', 'crow',
  'dingo', 'dinosaur', 'dolphin', 'duck', 'elephant', 'ferret', 'fox', 'frog', 'giraffe', 'gopher', 'grizzly',
  'hedgehog', 'hippo', 'hyena', 'ibex', 'ifrit', 'iguana', 'jackal', 'jackalope', 'kangaroo', 'koala', 'kraken',
  'lemur', 'leopard', 'liger', 'llama', 'manatee', 'mink', 'monkey', 'moose', 'narwhal', 'nyan_cat', 'orangutan',
  'otter', 'panda', 'penguin', 'platypus', 'python', 'quagga', 'rabbit', 'racoon', 'rhino', 'sheep', 'shrew',
  'skunk', 'slow_loris', 'squirrel', 'turtle', 'walrus', 'wolf', 'wolverine', 'wombat'
];

const baseUrl = 'https://ssl.gstatic.com/docs/common/profile/';

export const getRandomAvatar = () => {
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${baseUrl}${randomAnimal}_lg.png`;
};
