let rotor1 = ["L", "G", "Q", "N", "M", "W", " ", "Y", "V", "T", "E", "B", "O", "D", "U", "H", "Z", "F", "K", "P", "C", "S", "A", "J", "R", "I", "X"];
let rotor2 = [" ", "O", "V", "Z", "N", "D", "T", "K", "A", "Q", "L", "C", "J", "R", "W", "Y", "M", "P", "X", "I", "B", "G", "H", "F", "U", "E", "S"];
let rotor3 = ["M", "C", "K", "E", "U", "V", "N", "I", "T", "H", "P", "Z", "X", "Y", "F", "O", "Q", " ", "S", "A", "G", "J", "L", "B", "D", "W", "R"];
let rotor4 = ["E", "I", "W", "B", "P", "S", "T", "J", "C", "V", "O", "G", "K", "Z", "H", "F", "N", "L", " ", "M", "D", "R", "Y", "X", "Q", "A", "U"];
let rotor5 = ["J", "V", "U", "E", "Y", "O", "G", "I", "D", " ", "Q", "Z", "K", "H", "T", "R", "P", "X", "A", "W", "S", "B", "N", "M", "C", "L", "F"];

function removeAccentOfChar(char) {
	let charWithAccent = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
	let charWithoutAccent = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";

	let indexAccent = charWithAccent.indexOf(char);
	if (indexAccent != -1) return charWithoutAccent.substr(indexAccent, 1);
	return char;
}


let inicial1, inicial2, inicial3, oldinicial1, oldinicial2, oldinicial3, primeiroRotor, segundoRotor, terceiroRotor, inputTextCrypt, outputTextCrypt, inputTextDecrypt, outputTextDecrypt;


document.getElementById("bttCrypt").addEventListener("click", function() {
  // COMENTÁRIO: Tudo que é recuperado via JavaScript é STRING. Portanto, é necessário converter para números.
    inicial1 = Number(document.getElementById("inicial1").value);
    inicial2 = Number(document.getElementById("inicial2").value);
    inicial3 = Number(document.getElementById("inicial3").value);
    oldinicial1 = inicial1;
    oldinicial2 = inicial2;
    oldinicial3 = inicial3;

    getRotors();
});


document.getElementById("bttDecrypt").addEventListener("click", function() {
  // COMENTÁRIO: Tudo que é recuperado via JavaScript é STRING. Portanto, é necessário converter para números.
    inicial1 = Number(document.getElementById("inicial1").value);
    inicial2 = Number(document.getElementById("inicial2").value);
    inicial3 = Number(document.getElementById("inicial3").value);
    oldinicial1 = inicial1;
    oldinicial2 = inicial2;
    oldinicial3 = inicial3;

    getRotors();
});


inputTextCrypt = document.getElementById("cryptIn");
outputTextCrypt = document.getElementById("cryptOut");


document.getElementById("crypt").addEventListener("click", function (event) {
    let key = event.target;

    if(key.value === "") {
        inputTextCrypt.value += key.innerText;
    } else if(key.id === "space") {
        inputTextCrypt.value += " ";
    } else if(key.id === "erase" && inputTextCrypt.value.length > 0) {
        inputTextCrypt.value = inputTextCrypt.value.substr(0, inputTextCrypt.value.length - 1);
    } else if(key.id === "enter") {
        inputTextCrypt.value += "\r\n";
    }
    inputTextCrypt.dispatchEvent(new Event("input"));
});


inputTextCrypt.addEventListener("input", function(event) {
    outputTextCrypt.value = "";
    inicial1 = oldinicial1;
    inicial2 = oldinicial2;
    inicial3 = oldinicial3;
    for(let i in inputTextCrypt.value) {
    	let letter = removeAccentOfChar(inputTextCrypt.value[i]).toUpperCase();
        if(plugs[letter] !== undefined) {
          // COMENTÁRIO: passa a letra pelo plug ANTES de realizar a criptografia
            new_letter = encryptLetter(parseInt(inicial1), parseInt(inicial2), parseInt(inicial3), primeiroRotor, segundoRotor, terceiroRotor, plugs[letter]);
            // COMENTÁRIO: passa a letra pelo plug DEPOIS de realizar a criptografia
            outputTextCrypt.value += plugs[new_letter];
            rotorUp();
            console.log(new_letter, inicial1, inicial2, inicial3);
        } else {
            outputTextCrypt.value += letter;
        }
    }
});


inputTextDecrypt = document.getElementById("decryptIn");
outputTextDecrypt = document.getElementById("decryptOut");


document.getElementById("decrypt").addEventListener("click", function (event) {
    let key = event.target;

    if(key.value === "") {
        inputTextDecrypt.value += key.innerText;
    } else if(key.id === "space2") {
        inputTextDecrypt.value += " ";
    } else if(key.id === "erase2" && inputTextDecrypt.value.length > 0) {
        inputTextDecrypt.value = inputTextDecrypt.value.substr(0, inputTextDecrypt.value.length - 1);
    } else if(key.id === "enter2") {
        inputTextCrypt.value += "\r\n";
    }
    inputTextDecrypt.dispatchEvent(new Event("input"));
});


inputTextDecrypt.addEventListener("input", function(event) {
    outputTextDecrypt.value = "";
    inicial1 = oldinicial1;
    inicial2 = oldinicial2;
    inicial3 = oldinicial3;
    for(let i in inputTextDecrypt.value) {
      // COMENTÁRIO: Garante que a entrada de dados para o processo de descriptografia esteja correto
      let letter = removeAccentOfChar(inputTextDecrypt.value[i]).toUpperCase();
        if(plugs[letter] !== undefined) {
            // COMENTÁRIO: passa a letra pelo plug ANTES de realizar a descriptografia
            new_letter = encryptLetter(parseInt(inicial3), parseInt(inicial2), parseInt(inicial1), terceiroRotor, segundoRotor, primeiroRotor, plugs[letter]);
            // COMENTÁRIO: passa a letra pelo plug DEPOIS de realizar a descriptografia
            outputTextDecrypt.value += plugs[new_letter];
            rotorUp();
            console.log(new_letter, inicial1, inicial2, inicial3);
        } else {
            outputTextDecrypt.value += inputTextDecrypt.value[i].toUpperCase();
        }
    }
});


function encryptLetter(inicial1, inicial2, inicial3, rotor_1, rotor_2, rotor_3, letter) {
    if(!rotor1.includes(letter)) {
        return letter;
    }

    let letter_index = rotor_1.indexOf(letter);
    return rotor_3[nextLetter(nextLetter(letter_index, inicial1, inicial2), inicial2, inicial3)];

    function nextLetter(letter, first_rotor, second_rotor) {
        let action = second_rotor + letter - first_rotor;
        if (action > 26) {
            action -= 27
        } else if (action < 0) {
            action += 27;
        }
        return action;
    }
}


function getRotors() {
    let rotors = [rotor1, rotor2, rotor3, rotor4, rotor5];

    let elements = document.getElementById("rotor1").children;
    for(let i = 0; i < elements.length - 1; i++) {
        if(elements[i].children[0].checked) primeiroRotor = rotors[i];
    }

    elements = document.getElementById("rotor2").children;
    for(let i = 0; i < elements.length - 1; i++) {
        if(elements[i].children[0].checked) segundoRotor = rotors[i];
    }

    elements = document.getElementById("rotor3").children;
    for(let i = 0; i < elements.length - 1; i++) {
        if(elements[i].children[0].checked) terceiroRotor = rotors[i];
    }
}


// function oldRotorUp() {
//     if (inicial1 < 26) {
//         inicial1++;
//     } else {
//         inicial1 = 0;
//         if (inicial2 < 26) {
//             inicial2++;
//         } else {
//             inicial2 = 0;
//             if (inicial3 < 26) {
//                 inicial3++;
//             } else {
//                 inicial3 = 0;
//             }
//         }
//     }
// }


function rotorUp() {
  let lcm = lcm_two_numbers(lcm_two_numbers(inicial1, inicial2), inicial3);
  let addToinicial1 = 1;
  if (inicial1 > 0 && inicial2 > 0 && inicial3 > 0 && lcm > 1000) {
    addToinicial1 = 3;
  } else {
    if (inicial2 % 2 == 0) {
      if (inicial1 > 3 && inicial1 % 2 == 0 && inicial1 % 3 == 0) {
        addToinicial1 = 2;
      } else if (isPrime(inicial1)) {
        addToinicial1 = 2;
      } else {
        addToinicial1 = 1;
      }
    } else {
      if (inicial1 > 3 && inicial1 % 2 == 0 && inicial1 % 3 == 0) {
        addToinicial1 = 1;
      } else if (isPrime(inicial1)) {
        addToinicial1 = 1;
      } else {
        addToinicial1 = 2;
      }
    }
  }

  if (inicial1 + addToinicial1 <= 26) {
    console.log('oi');
      inicial1 = inicial1 + addToinicial1;
  } else {
      inicial1 = (inicial1 + addToinicial1) % 27;
      if (inicial2 < 26) {
          inicial2++;
      } else {
          inicial2 = 0;
          if (inicial3 < 26) {
             inicial3++;
          } else {
            inicial3 = 0;
            // COMENTÁRIO: Nesse ponto é necessário apenas incremetar a posição do rotor inicial em 1
            //oldRotorUp();
            inicial1++;
          }
      }
  }
}


function lcm_two_numbers(x, y) {
  return (!x || !y) ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
}


function gcd_two_numbers(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}


function isPrime(num) {
  return [2, 3, 5, 7, 11, 13, 17, 19, 23].includes(num);
}



