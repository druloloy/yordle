import mongoose from 'mongoose';

type MatchType = 'exact' | 'exists' | 'wrong';

type ResultType = Array<{
  [letter: string]: MatchType;
}>;

export interface Sessions extends mongoose.Document {
  fingerprint: string;
  word: string;
  streak: number;
  wordGivenAt: Date;
  tries?: Array<ResultType>;
  solved?: boolean;
  solvedAt?: Date;
}

const SessionSchema = new mongoose.Schema<Sessions>(
  {
    fingerprint: {
      type: String,
      required: true,
    },
    word: {
      type: String,
      required: true,
      maxlength: 5,
    },
    streak: {
      type: Number,
      required: true,
      default: 0,
    },
    wordGivenAt: {
      type: Date,
      required: true,
      default: new Date(),
    },
    tries: {
      type: Array<ResultType>,
      default: [],
      required: false,
      maxlength: 6,
    },
    solved: {
      type: Boolean,
      required: false,
      default: false,
    },
    solvedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Session || mongoose.model<Sessions>('Session', SessionSchema);
