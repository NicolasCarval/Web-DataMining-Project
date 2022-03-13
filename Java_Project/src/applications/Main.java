/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package applications;

import com.hp.hpl.jena.rdf.model.Model;
import tools.JenaEngine;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.simple.parser.JSONParser;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;


/**
 * @author DO.ITSUDPARIS
 */
public class Main {
	/**
	 * @param args
	 *            the command line arguments
	 */
	public static void main(String[] args) {
		String NS = "";
		// lire le model a partir d'une ontologie
		Model model = JenaEngine.readModel("data/ontology.owl");
		if (model != null) {
			//lire le Namespace de l'ontologie
			NS = model.getNsPrefixURI("");
			// modifier le model
			
			
			// Ajouter une nouvelle femme dans le modele: Nora, 50, estFilleDe Peter
			JenaEngine.createInstanceOfClass(model, NS, "Female", "Nora");
			JenaEngine.updateValueOfDataTypeProperty(model, NS, "Nora", "age", 50);
			JenaEngine.updateValueOfObjectProperty(model, NS, "Nora", "isDaughterOf", "Peter");

			// Ajouter un nouvel homme dans le modele: Rob, 51, seMarierAvec Nora
			JenaEngine.createInstanceOfClass(model, NS, "Male", "Rob");
			JenaEngine.updateValueOfDataTypeProperty(model, NS, "Rob", "age", 51);
			JenaEngine.updateValueOfDataTypeProperty(model, NS, "Rob", "name", "Rob Yeung");
			JenaEngine.updateValueOfObjectProperty(model, NS, "Rob", "isMarriedWith", "Nora");
			
			//apply owl rules on the model
			//Model owlInferencedModel = JenaEngine.readInferencedModelFromRuleFile(model, "data/owlrules.txt");
			// apply our rules on the owlInferencedModel
			//Model inferedModel = JenaEngine.readInferencedModelFromRuleFile(owlInferencedModel, "data/rules.txt");
			// query on the model after inference
			//System.out.println(JenaEngine.executeQueryFile(inferedModel,
			//		"data/query.txt"));
			/*for (int i = 2; i < 18; i++) {
				String temp = "data/query"+i+".txt";
				System.out.println(JenaEngine.executeQueryFile(inferedModel,
						temp));
				}*/

			
		} else {
			System.out.println("Error when reading model from ontology");
		}
	}
}
