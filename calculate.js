function calculateSubnet() {
    var ipAddress = document.getElementById("ipAddress").value;
    var cidrSuffix = document.getElementById("cidrSuffix").value;

    // Berechnungen für Subnetz 
    var subnetMask = calcSubnetMask(cidrSuffix);
    var numIpAddresses = calcNumIpAddresses(cidrSuffix);
    var numHosts = calcNumHosts(cidrSuffix);
    var networkAddress = calcNetworkAddress(ipAddress, subnetMask);
    var broadcastAddress = calcBroadcastAddress(networkAddress, cidrSuffix);

    document.getElementById("results").innerHTML = "<h2>Ergebnisse</h2>" +
        "<p>Netzmaske: " + subnetMask + "</p>" +
        "<p>Anzahl IP-Adressen: " + numIpAddresses + "</p>" +
        "<p>Anzahl Host-Adressen: " + numHosts + "</p>" +
        "<p>Netzwerkadresse: " + networkAddress + "</p>" +
        "<p>Broadcastadresse: " + broadcastAddress + "</p>" 
}

function calcSubnetMask(cidrSuffix) {
    var subnetMask = "";
    for (var i = 0; i < 32; i++) {
        if (i < cidrSuffix) {
            subnetMask += "1";
        } else {
            subnetMask += "0";
        }
        if ((i + 1) % 8 == 0 && i < 31) {
            subnetMask += ".";
        }
    }
    // Subnetzmaske in dezimale Form umwandeln und zurückgeben
    return subnetMask.split(".").map(function (binary) {
        return parseInt(binary, 2);
    }).join(".");
}


function calcNumIpAddresses(cidrSuffix) {
    return Math.pow(2, 32 - cidrSuffix);
}


function calcNumHosts(cidrSuffix) {
    // Anzahl der verfügbaren Host-Adressen berechnen
    var numHosts = Math.pow(2, 32 - cidrSuffix);
    // Anzahl der verfügbaren Host-Adressen zurückgeben (abzüglich Netzwerk- und Broadcastadresse)
    return numHosts - 2;
}

function calcNetworkAddress(ipAddress, subnetMask) {
    // IP-Adresse und Subnetzmaske in Arrays aufteilen
    var ipArray = ipAddress.split(".");
    var maskArray = subnetMask.split(".");

    // Netzwerkadresse berechnen
    var networkAddress = [];
    for (var i = 0; i < 4; i++) {
        networkAddress.push(ipArray[i] & maskArray[i]);
    }

    // Netzwerkadresse als String zurückgeben
    return networkAddress.join(".");
}

function calcBroadcastAddress(networkAddress, cidrSuffix) {
    // Netzwerkadresse in ein Array aufteilen
    var networkArray = networkAddress.split(".");

    // CIDR-Suffix in eine Zahl umwandeln
    var suffix = parseInt(cidrSuffix.replace("/", ""));

    // Anzahl der verfügbaren Hosts im Subnetz berechnen
    var numHosts = Math.pow(2, 32 - suffix);

    // Die Netzwerkadresse in Binärform konvertieren
    var binaryNetwork = "";
    networkArray.forEach(function(octet) {
        binaryNetwork += ("00000000" + parseInt(octet).toString(2)).slice(-8);
    });

    // Die Host-Bits auf 1 setzen, um die Broadcast-Adresse zu erhalten
    var broadcastBinary = binaryNetwork.substring(0, suffix) + "1".repeat(32 - suffix);

    // Die Broadcast-Adresse in Oktette konvertieren
    var broadcastArray = [];
    for (var i = 0; i < 4; i++) {
        broadcastArray.push(parseInt(broadcastBinary.substr(i * 8, 8), 2));
    }

    // Broadcast-Adresse als String zurückgeben
    return broadcastArray.join(".");
}

