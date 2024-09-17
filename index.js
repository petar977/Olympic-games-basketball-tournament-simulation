let groups = require("./groups.json");
let exibitions = require("./exibitions.json");

GameSimulation(groups, exibitions);

function GameSimulation(groups, exibitions) {
	// Collecting results from friendly matches for form calculation.
	for (let i in exibitions) {
		let groupA = groups.A;
		let team = groupA.find(x => x.ISOCode == i)
		if (team === undefined) {
			let groupB = groups.B;
			team = groupB.find(x => x.ISOCode == i)
		}
		if (team === undefined) {
			let groupC = groups.C;
			team = groupC.find(x => x.ISOCode == i)
		}

		let result = exibitions[i][0].Result;
		let resultSplit = result.split("-");
		if (parseInt(resultSplit[0]) > parseInt(resultSplit[1])) {
			if (!team.exwins) {
				team.exwins = 0;
				team.exloses = 0;
				team.totalGamesPlayed = 0;
			}
			team.exwins += 1;
			team.totalGamesPlayed += 1;
		} else {
			if (!team.exwins) {
				team.exloses = 0;
				team.exwins = 0;
				team.totalGamesPlayed = 0;
			}
			team.exloses += 1;
			team.totalGamesPlayed += 1;
		}
		let result1 = exibitions[i][1].Result;
		let resultSplit1 = result1.split("-");
		if (parseInt(resultSplit1[0]) > parseInt(resultSplit1[1])) {
			team.exwins += 1;
			team.totalGamesPlayed += 1;
		} else {
			team.exloses += 1;
			team.totalGamesPlayed += 1;
		}
	}

	console.log(`Grupna faza:`);

	// Logic for group stage

	var arr = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
	for (let x in groups) {
		console.log(`   Grupa ${x}:`)
		for (let i = 0; i < arr.length; i++) {
			var t1 = arr[i][0],
				t2 = arr[i][1];

			var team1 = groups[x][t1],
				team2 = groups[x][t2];

			if (!team1.pts) {
				team1.pts = 0;
				team1.wins = 0;
				team1.loses = 0;
				team1.ptsMade = 0;
				team1.ptsReceived = 0;
			}
			if (!team2.pts) {
				team2.pts = 0;
				team2.wins = 0;
				team2.loses = 0;
				team2.ptsMade = 0;
				team2.ptsReceived = 0;
			}
			for (let i in exibitions) {
				if (team1.ISOCode == i) {
					let result = exibitions[i][0].Result;
					let resultSplit = result.split("-");
					if (parseInt(resultSplit[0]) > parseInt(resultSplit[1])) {
						team1.exwins += 1;
						team2.exloses += 1;
					} else {
						team2.exwins += 1;
						team1.exloses += 1;
					}
					let result1 = exibitions[i][1].Result;
					let resultSplit1 = result1.split("-");
					if (parseInt(resultSplit1[0]) > parseInt(resultSplit1[1])) {
						team1.exwins += 1;
						team2.exloses += 1;
						team1.totalGamesPlayed += 1;
						team2.totalGamesPlayed += 1;
					} else {
						team2.exwins += 1;
						team1.exloses += 1;
						team1.totalGamesPlayed += 1;
						team2.totalGamesPlayed += 1;
					}
					break;
				}
			}
			var scoreArr = scoreSimulation(team1, team2)
			var score1 = scoreArr[0];
			var score2 = scoreArr[1];
			if (score1 >= score2) {
				team1.pts += 2;
				team1.wins += 1;
				team1.ptsMade += score1;
				team1.ptsReceived += score2;
				team1.totalGamesPlayed += 1;
				team2.loses += 1;
				team2.ptsMade += score2;
				team2.ptsReceived += score1;
				team2.pts += 1;
				team2.totalGamesPlayed += 1;

			} else {
				team2.pts += 2;
				team2.wins += 1;
				team2.ptsMade += score2;
				team2.ptsReceived += score1;
				team2.totalGamesPlayed += 1;
				team1.loses += 1;
				team1.ptsMade += score1;
				team1.ptsReceived += score2;
				team1.pts += 1;
				team1.totalGamesPlayed += 1;
			}
			scoreArr = [];
			console.log(`      ${team1.Team} - ${team2.Team} (${score1}:${score2})`);
		}
	}
	for (let i in groups) {
		groups[i].sort((x, y) => {
			if (x.pts > y.pts) {
				return -1;
			}
			if (x.pts < y.pts) {
				return 1;
			}
			if (x.pts == y.pts) {
				x.total = x.ptsMade - x.ptsReceived;
				y.total = y.ptsMade - y.ptsReceived;

				if (x.total > y.total) {
					return -1;
				}
				return 1;
			}
		})
	}
	var last8 = [];
	console.log("Konačan plasman u grupama:");

	// Logic for group table
	for (let x in groups) {
		last8 = last8.concat(groups[x].slice(0, 3))
		console.log(`   Grupa ${x} (Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika):`)
		for (let y = 0; y < 4; y++) {
			let total = groups[x][y].ptsMade - groups[x][y].ptsReceived;
			console.log(`      ${y + 1}. ${groups[x][y].Team} ${groups[x][y].wins} / ${groups[x][y].loses} / ${groups[x][y].pts} / ${groups[x][y].ptsMade}/${groups[x][y].ptsReceived} / ${total}`);
		}
	}
	last8.pop();
	var hats = [];
	var arrayHats = [[0, 6], [3, 1], [7, 4], [5, 2]];
	console.log(`Sesiri:`);
	for (let y = 0; y < arrayHats.length; y++) {
		var t1 = arrayHats[y][0],
			t2 = arrayHats[y][1];

		var team1 = last8[t1],
			team2 = last8[t2];

		hats.push(team1, team2);
		switch (y) {
			case 0:
				console.log(`  Šešir D
    	${team1.Team}
        ${team2.Team}`);
				break;
			case 1:
				console.log(`  Šešir E
	${team1.Team}
	${team2.Team}`);
				break;
			case 2:
				console.log(`  Šešir F
	${team1.Team}
	${team2.Team}`);
				break;
			case 3:
				console.log(`  Šešir G
	${team1.Team}
	${team2.Team}`);
				break;
		}
	}

	var last8Fixt = [[0, 6], [3, 5], [1, 7], [2, 4]];
	var last4Fixt = [[0, 1], [2, 3]];
	var last2Fixt = [[0, 1]];
	var semifinals = [];
	var finals = [];
	var goldMedalist = [];
	var silverMedal = [];
	var thirdPlaceMatch = [];
	var bronzeMedal = [];
	var fourthPlace = [];

	knockOut("Eliminaciona runda:", last8Fixt, hats);
	knockOut("Cetvrtfinale:", last8Fixt, hats, semifinals);
	knockOut("Polufinale:", last4Fixt, semifinals, finals, thirdPlaceMatch);
	knockOut("Utakmica za trece mesto:", last2Fixt, thirdPlaceMatch, bronzeMedal, fourthPlace)
	knockOut("Finale", last2Fixt, finals, goldMedalist, silverMedal);

	console.log(`Medalje:
	1. ${goldMedalist[0].Team}
	2. ${silverMedal[0].Team}
	3. ${bronzeMedal[0].Team}`);
}

function scoreSimulation(team1, team2) {
	var gameLogic = function () {
		let perf = Math.random() * 0.30,
			luck = Math.random() * 0.20;
		return (luck + perf).toFixed(2);
	};
	let score = Math.floor(Math.random() * (130 - 50 + 1)) + 50;
	let score1 = Math.floor(Math.random() * (130 - 50 + 1)) + 50;
	let ponderRang = 0.3;
	let ponderForm = 0.7;
	let team1Rang = (213 - team1.FIBARanking + 1) / 213;
	let team2Rang = (213 - team2.FIBARanking + 1) / 213;
	if (team1.totalGamesPlayed == 0) {
		team1FormCalc = 0;
	} else {
		team1FormCalc = ((team1.wins + team1.exwins) * 2) + ((team1.loses + team1.exloses) * 1) / team1.totalGamesPlayed;
	}
	if (team2.totalGamesPlayed == 0) {
		team2FormCalc = 0;
	} else {
		team2FormCalc = ((team2.wins + team2.exwins) * 2) + ((team2.loses + team2.exloses) * 1) / team2.totalGamesPlayed;
	}

	let team1NormForm = team1FormCalc / 3;
	let team2NormForm = team2FormCalc / 3;
	let team1PonderedRang = (team1Rang * ponderRang) + (team1NormForm * ponderForm);
	let team2PonderedRang = (team2Rang * ponderRang) + (team2NormForm * ponderForm);

	let team1wins = 1 / (1 + Math.pow(10, (team2PonderedRang - team1PonderedRang) / 0.1));
	let team2wins = 1 / (1 + Math.pow(10, (team1PonderedRang - team2PonderedRang) / 0.1));

	let team1Perf = team1wins + Number(gameLogic());
	let team2Perf = team2wins + Number(gameLogic());
	if (team1Perf > team2Perf) {
		if (score > score1) {
			return [score, score1];
		}
		return [score1, score];
	}
	if (score > score1) {
		return [score1, score];
	}
	return [score, score1];
}

function knockOut(stage, arrayFixt, arrayTeams, arrayQual, arrayLoses) {
	console.log(`${stage}`);
	for (let y = 0; y < arrayFixt.length; y++) {
		var t1 = arrayFixt[y][0],
			t2 = arrayFixt[y][1];

		var team1 = arrayTeams[t1];
		var team2 = arrayTeams[t2];

		if (stage == "Eliminaciona runda:") {
			console.log(`  ${team1.Team} - ${team2.Team}`);
		} else {
			var scoreArr = scoreSimulation(team1, team2)
			var score1 = scoreArr[0];
			var score2 = scoreArr[1];
			if (score1 > score2) {
				arrayQual.push(team1);
				if (arrayFixt.length == 2) {
					arrayLoses.push(team2);
				}
				if (arrayFixt.length == 1) {
					arrayLoses.push(team2);
				}
			} else {
				arrayQual.push(team2);
				if (arrayFixt.length == 2) {
					arrayLoses.push(team1);
				}
				if (arrayFixt.length == 1) {
					arrayLoses.push(team1);
				}
			}
			console.log(`  ${team1.Team} - ${team2.Team} (${score1}:${score2})`);
		}
	}
}