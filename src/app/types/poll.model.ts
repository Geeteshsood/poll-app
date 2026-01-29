export interface Poll {
  id: number | null;
  question: string;
  options: OptionVote[];
}

export interface OptionVote {
  optionText: string;
  voteCount: number;
}
