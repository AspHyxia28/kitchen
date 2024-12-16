"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

interface CharacterBuild {
  id: string;
  Playable_Characters_id: string;
  Relic_Headpiece_id: string;
  Relic_Handpiece_id: string;
  Relic_Bodypiece_id: string;
  Relic_Feetpiece_id: string;
  Relic_Planarsphere_id: string;
  Relic_Linkrope_id: string;
}

interface Relic {
    id: string;
    name: string; // Relic_Set name
    details: {
      mainStat: string;
      mainStatNum: number;
      substats: {
        name: string;
        value: number;
      }[];
    };
}  

interface Character {
  id: string;
  name: string;
}

export default function CharacterBuildCRUD() {
  const [characterBuilds, setCharacterBuilds] = useState<CharacterBuild[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [relics, setRelics] = useState<{
    headpieces: Relic[];
    handpieces: Relic[];
    bodypieces: Relic[];
    feetpieces: Relic[];
    planarspheres: Relic[];
    linkropes: Relic[];
  }>({
    headpieces: [],
    handpieces: [],
    bodypieces: [],
    feetpieces: [],
    planarspheres: [],
    linkropes: [],
  });

  const [form, setForm] = useState<CharacterBuild>({
    id: "",
    Playable_Characters_id: "",
    Relic_Headpiece_id: "",
    Relic_Handpiece_id: "",
    Relic_Bodypiece_id: "",
    Relic_Feetpiece_id: "",
    Relic_Planarsphere_id: "",
    Relic_Linkrope_id: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCharacterBuilds();
    fetchCharacters();
    fetchRelics();
  }, []);

  const fetchCharacterBuilds = async () => {
    const res = await fetch("/api/character_build");
    const data: CharacterBuild[] = await res.json();
    setCharacterBuilds(data);
  };

  const fetchCharacters = async () => {
    const res = await fetch("/api/character_build?action=get-characters");
    const data: Character[] = await res.json();
    setCharacters(data);
  };

  const fetchRelics = async () => {
    const res = await fetch("/api/character_build?action=get-relics");
    const data = await res.json();
    setRelics(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const endpoint = isEditing ? `/api/character_build` : "/api/character_build";
    const method = isEditing ? "PUT" : "POST";

    await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      id: "",
      Playable_Characters_id: "",
      Relic_Headpiece_id: "",
      Relic_Handpiece_id: "",
      Relic_Bodypiece_id: "",
      Relic_Feetpiece_id: "",
      Relic_Planarsphere_id: "",
      Relic_Linkrope_id: "",
    });
    setIsEditing(false);
    fetchCharacterBuilds();
  };

  const handleEdit = (characterBuild: CharacterBuild) => {
    setForm(characterBuild);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/character_build?id=${id}`, { method: "DELETE" });
    fetchCharacterBuilds();
  };

  return (
    <div className="min-h-screen p-8 bg-no-repeat bg-cover bg-home">
      <h1 className="text-2xl font-bold mb-4">Manage Character Builds</h1>
      <Navbar />

      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded bg-blue-900">
        <h2 className="text-lg font-bold mb-4">
          {isEditing ? "Edit Character Build" : "Add New Character Build"}
        </h2>
        <div className="grid grid-cols-2 gap-4 font-bold text-black">
          <select
            value={form.Playable_Characters_id}
            onChange={(e) =>
              setForm({ ...form, Playable_Characters_id: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Character</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
          {Object.entries(relics).map(([key, relicList]) => (
            <select
                key={key}
                value={form[`${key.replace("pieces", "_id")}` as keyof CharacterBuild]}
                onChange={(e) =>
                setForm({
                    ...form,
                    [`${key.replace("pieces", "_id")}` as keyof CharacterBuild]: e.target.value,
                })
                }
                className="p-2 border border-gray-300 rounded"
                required
            >
                {relicList.map((relic) => (
                <option key={relic.id} value={relic.id}>
                    {`${relic.name} - ${relic.details.mainStat} (${relic.details.mainStatNum}) | 
                    Substats: ${relic.details.substats
                        .map((sub) => `${sub.name} (${sub.value})`)
                        .join(", ")}`}
                </option>
                ))}
            </select>
            ))}
        </div>
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          {isEditing ? "Update Character Build" : "Add Character Build"}
        </button>
      </form>

      <table className="w-full bg-blue-900">
        <thead>
          <tr className="bg-blue-500">
            <th className="border border-gray-300 p-2">Character</th>
            <th className="border border-gray-300 p-2">Relic Headpiece</th>
            <th className="border border-gray-300 p-2">Relic Handpiece</th>
            <th className="border border-gray-300 p-2">Relic Bodypiece</th>
            <th className="border border-gray-300 p-2">Relic Feetpiece</th>
            <th className="border border-gray-300 p-2">Relic Planarsphere</th>
            <th className="border border-gray-300 p-2">Relic Linkrope</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {characterBuilds.map((build) => (
            <tr key={build.id}>
              <td className="border border-gray-300 p-2">{build.Playable_Characters_id}</td>
              <td className="border border-gray-300 p-2">{build.Relic_Headpiece_id}</td>
              <td className="border border-gray-300 p-2">{build.Relic_Handpiece_id}</td>
              <td className="border border-gray-300 p-2">{build.Relic_Bodypiece_id}</td>
              <td className="border border-gray-300 p-2">{build.Relic_Feetpiece_id}</td>
              <td className="border border-gray-300 p-2">{build.Relic_Planarsphere_id}</td>
              <td className="border border-gray-300 p-2">{build.Relic_Linkrope_id}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEdit(build)}
                  className="mr-2 p-1 bg-yellow-400 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(build.id)}
                  className="p-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}