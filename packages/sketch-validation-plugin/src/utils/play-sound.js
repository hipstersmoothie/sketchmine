/**
 * 
 * @param {string} type System Sound type
 */
export function playSound(type) {
  const SystemSounds = {
    Basso: "Basso",
    Blow: "Blow",
    Bottle: "Bottle",
    Frog: "Frog",
    Funk: "Funk",
    Glass: "Glass",
    Hero: "Hero",
    Morse: "Morse",
    Ping: "Ping",
    Pop: "Pop",
    Purr: "Purr",
    Sosumi: "Sosumi",
    Submarine: "Submarine",
    Tink: "Tink",
  };

  var sound = NSSound.soundNamed(SystemSounds[type]);
  sound.play();
}
