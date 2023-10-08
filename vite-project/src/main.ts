import './style.css'

const firstNames = ['Victor', 'Anna', 'Maria', 'Tomas', 'Greg', 'Sarah'];
const lastNames = ['Smith', 'Green', 'Gray', 'Potter', 'Jackson'];

const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const today = new Date();

interface Mortgage {
    dateStart: Date;
    dateEnd: Date;
    amount: number;
}

interface Person {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    earnings: number;
    spendings: number;
    mortgage: Mortgage;
}

const persons: Person[] = new Array(50).fill(' ').map(it => {
    const dateOfBirth = new Date(random(1950, 2000), random(0, 11), random(1, 28));
    
    const dateOfStart = new Date(dateOfBirth);
    dateOfStart.setFullYear(dateOfStart.getFullYear() + random(20, 70)) //dateOfStart is at least 20 years after dateOfBirth and not later than 70 years
    const dateOfEnd = new Date(dateOfStart) 
    dateOfEnd.setFullYear(dateOfEnd.getFullYear() + random(10, 30)) //random dateOfEnd between 10 and 30 years after dateStart
    
    return {
        firstName: firstNames.slice().sort(() => Math.random() - 0.5),
        lastName: lastNames.slice().sort(() => Math.random() - 0.5),
        dateOfBirth,
        earnings: random(1000, 1000000),
        spendings: random(500, 250000),
        // fill in the date of start and date of end + random amount
        // dateStart should be random but not earlier than 20 years old
        mortgage: {
          dateStart: dateOfStart,
          dateEnd: dateOfEnd,
          amount: random(50000, 500000),
        }
    }
})

console.log(persons)

interface Human {
    name: string; // firstname +  + lastname
    age: number; // full years to today's date
    remainingMoney: number; // earnings - spendings
    yearsToPay: number; // years left to pay mortgage ( if negative turn into 0 )
    amountToPay: number; // amount left to pay mortgage ( if negative turn into 0 )
    monthlyMortgage: number; // added for 4th task
}

/** 1. Transform all Persons into Human */

const calculateAge = (dateOfBirth: Date): number => {
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear()

  // check if the birthday has occurred this year or not
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const calculateMonthlyMortgage = (mortgage: Mortgage, yearsToPay: number): number => {
  // calculate the monthly mortgage amount
  return mortgage.amount / (yearsToPay * 12);
}

const humans: Human[] = persons.map((person) => {
  const name = `${person.firstName[0]} ${person.lastName[0]}`;
  const remainingMoney = person.earnings - person.spendings;
  const age = calculateAge(person.dateOfBirth)

  const yearsToPay = Math.max(person.mortgage.dateEnd.getFullYear() - today.getFullYear(), 0);

  // added annual payment
  const annualPayment = yearsToPay > 0 ? person.mortgage.amount / yearsToPay : 0;

  const amountToPay = Math.max(annualPayment * yearsToPay, 0)

  // 4th task
  const monthlyMortgage = calculateMonthlyMortgage(person.mortgage, yearsToPay);

  return {
    name,
    remainingMoney,
    age,
    yearsToPay, 
    amountToPay,
    monthlyMortgage,
  }
})

console.log(humans)

/** 2. Find max and min aged Human in the list with one function */

const findMinMaxAgedHumans = (humans) => {
  // check if the input array is empty. if yes - return NaN
  if (humans.length === 0) {
    return {
      maxAge: NaN, 
      minAge: NaN
    }
  }

  // initializing maxAge as negative infinity and minAge as positive infinity
  const result = humans.reduce((accumulator, currentHuman) => {
    // get the age of the current human 
    const currentAge = currentHuman.age;

    // update maxAge if the current age is greater.
    if (currentAge > accumulator.maxAge) {
        accumulator.maxAge = currentAge;
    }

    // update minAge if the current age is smaller
    if (currentAge < accumulator.minAge) {
      accumulator.minAge = currentAge;
    }

    return accumulator
  }, {maxAge: -Infinity, minAge: Infinity})

  // return an object containing the calculated maxAge and minAge
  return result;
}

const { maxAge, minAge } = findMinMaxAgedHumans(humans);

console.log(`Maximum Age: ${maxAge}`);
console.log(`Minimum Age: ${minAge}`);

/** 3. Find all Human who has budget deficit */

// filter humans with remainingMoney < 0

const humansWithDeficit = humans.filter((human) => {
  return human.remainingMoney < 0;
}).map((human) => {
  return `Name: ${human.name}, Remaining Money: ${human.remainingMoney}`;
});

console.log(`Humans with Budget Deficit: ${'\n'}${humansWithDeficit.join("\n")}`);

/** 4. Calculate monthly amount of mortgage and sort it descending */

// sort humans in descending order based on monthly mortgage amount
humans.sort((a, b) => b.monthlyMortgage - a.monthlyMortgage);

console.log(humans);

/**
 * 1. Transform all Persons into Human
 * 2. Find max and min aged Human in the list with one function
 * 3. Find all Human who has budget deficit
 * 4. Calculate monthly amount of mortgage and sort it descending
 */

