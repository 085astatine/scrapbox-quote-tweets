type Formats = {
  uri: (value: string) => boolean;
  iri: (value: string) => boolean;
};
declare const formats: Formats;

export default formats;
