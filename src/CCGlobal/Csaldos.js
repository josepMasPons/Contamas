import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseLoc";

/**
 * Retorna el saldo d'un compte.
 *
 * @param {string} empresa Empresa
 * @param {string} compte  Format aa.aaa.aaa
 * @returns {number} Saldo
 */
export async function Csaldos(empresa, compte,perde,peral) {
  try {
    const q = query(
      collection(db, "MovsG"),
      where("M00", "==", empresa)
    );

    const querySnapshot = await getDocs(q);

    let saldo = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.M07 < perde || data.M07 > peral) {
        return; // passa al següent document
      }

      const importMov = Number(data.M04) || 0;

      // El compte és al DEURE
      if (data.M02 === compte) {
        saldo += importMov;
      }

      // El compte és a l'HAVER
      if (data.M03 === compte) {
        saldo -= importMov;
      }
    });

    return saldo;

  } catch (error) {
    console.error("Error calculant saldo:", error);
    return 0;
  }
}